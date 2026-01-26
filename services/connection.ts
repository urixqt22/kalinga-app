import {
    addDoc,
    arrayUnion,
    collection,
    doc,
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
        // 1. Find the Elder by name
        const usersRef = collection(db, "users");
        // exact match for now, case sensitivity depends on how name is stored vs input
        const q = query(usersRef, where("name", "==", elderName), where("role", "==", "SENIOR"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error(`No Elder found with the name "${elderName}".`);
        }

        // WARN: This picks the first one if duplicates exist. 
        // Ideally we should ask for a unique ID or show a list to pick from.
        const elderDoc = querySnapshot.docs[0];
        const elderId = elderDoc.id;

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
        await addDoc(requestsRef, {
            fromUserId: caretakerId,
            caretakerName: caretakerName,
            toUserId: elderId,
            status: 'pending',
            createdAt: serverTimestamp()
        });

        return { success: true, message: "Request sent successfully!" };

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
