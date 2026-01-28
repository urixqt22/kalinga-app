import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../configs/firebase";

export interface ConnectionRequest {
    id: string;
    fromUserId: string;
    caretakerName: string;
    toUserId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Timestamp;
}

export const sendConnectionRequest = async (elderName: string, caretakerId: string, caretakerName: string) => {
    try {
        // 1. Try to find by ID first
        const usersRef = collection(db, "users");
        let elderId = null;

        // Check if input is a valid UID (check if doc exists)
        const potentialDocRef = doc(db, "users", elderName);
        const potentialDocSnap = await getDoc(potentialDocRef);

        if (potentialDocSnap.exists() && potentialDocSnap.data().role === 'SENIOR') {
            elderId = elderName;
        } else {
            // Fallback to Name search
            const q = query(usersRef, where("name", "==", elderName), where("role", "==", "SENIOR"));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error(`No Elder found with the name or ID "${elderName}".`);
            }

            // WARN: This picks the first one if duplicates exist.
            elderId = querySnapshot.docs[0].id;
        }

        // 2. Check for existing pending request
        const requestsRef = collection(db, "connection_requests");
        const existingRequestQuery = query(
            requestsRef,
            where("fromUserId", "==", caretakerId),
            where("toUserId", "==", elderId),
            where("status", "==", "pending")
        );
        const existingRequestSnapshot = await getDocs(existingRequestQuery);

        if (!existingRequestSnapshot.empty) {
            throw new Error("You have already sent a request to this Elder.");
        }

        // 3. Create the request
        return {
            success: true,
            message: "Request sent successfully!",
            toUserId: elderId,
            requestId: (await addDoc(requestsRef, {
                fromUserId: caretakerId,
                caretakerName: caretakerName,
                toUserId: elderId,
                status: 'pending',
                createdAt: serverTimestamp()
            })).id
        };

    } catch (error) {
        throw error;
    }
};

export const getConnectionRequests = (userId: string, callback: (requests: ConnectionRequest[]) => void) => {
    const requestsRef = collection(db, "connection_requests");
    // Listen for requests where the user is the recipient (Elder) AND status is pending
    const q = query(
        requestsRef,
        where("toUserId", "==", userId),
        where("status", "==", "pending")
    );

    return onSnapshot(q, (snapshot) => {
        const requests: ConnectionRequest[] = [];
        snapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() } as ConnectionRequest);
        });
        callback(requests);
    });
};

export const respondToRequest = async (requestId: string, accept: boolean, caretakerId: string, elderId: string) => {
    try {
        const requestRef = doc(db, "connection_requests", requestId);

        if (!accept) {
            await updateDoc(requestRef, { status: 'rejected' });
            return;
        }

        // If accepted:
        // 1. Update request status
        await updateDoc(requestRef, { status: 'accepted' });

        // 2. Link Caretaker -> Elder (Add Elder to Caretaker's list)
        const caretakerRef = doc(db, "users", caretakerId);
        await updateDoc(caretakerRef, {
            linkedElders: arrayUnion(elderId)
        });

        // 3. Link Elder -> Caretaker (Add Caretaker to Elder's list)
        const elderRef = doc(db, "users", elderId);
        await updateDoc(elderRef, {
            linkedCaretakers: arrayUnion(caretakerId)
        });

    } catch (error) {
        console.error("Error responding to request:", error);
        throw error;
    }
};

export const removeConnection = async (caretakerId: string, elderId: string) => {
    try {
        const caretakerRef = doc(db, "users", caretakerId);
        await updateDoc(caretakerRef, {
            linkedElders: arrayRemove(elderId)
        });

        const elderRef = doc(db, "users", elderId);
        await updateDoc(elderRef, {
            linkedCaretakers: arrayRemove(caretakerId)
        });
        console.log(`[removeConnection] Removed caretaker ${caretakerId} from elder ${elderId}`);
    } catch (error) {
        console.error("Error removing connection:", error);
        throw error;
    }
};
