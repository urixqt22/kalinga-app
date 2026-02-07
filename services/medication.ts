import {
    addDoc,
    collection,
    deleteDoc,
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
import { sendNotification } from "./notification";

export interface Medication {
    id: string;
    elderId: string;
    caretakerId: string;
    name: string;
    dosage: string;
    time: string; // "HH:mm AM/PM"
    status: 'Scheduled' | 'Taken' | 'Skipped';
    createdAt: Timestamp;
}

export const addMedicationToFirestore = async (
    elderId: string,
    caretakerId: string,
    medData: { name: string; dosage: string; time: string }
) => {
    try {
        const medsRef = collection(db, "medications");
        await addDoc(medsRef, {
            elderId,
            caretakerId,
            name: medData.name,
            dosage: medData.dosage,
            time: medData.time,
            status: 'Scheduled',
            createdAt: serverTimestamp()
        });

        // Send Notification to Elder
        await sendNotification(
            elderId,
            "New Medication Added",
            `Your caretaker has added ${medData.name} ${medData.dosage} at ${medData.time}.`,
            'info',
            caretakerId
        );

        return { success: true };
    } catch (error) {
        console.error("Error adding medication:", error);
        throw error;
    }
};

export const getMedicationsRealtime = (elderId: string, callback: (meds: Medication[]) => void) => {
    const medsRef = collection(db, "medications");
    // Query: Get meds for this elder
    const q = query(
        medsRef,
        where("elderId", "==", elderId)
        // Note: Composite index might be required for where() + orderBy()
        // If index error occurs, remove orderBy temporarily or create index via link in console
    );

    return onSnapshot(q, (snapshot) => {
        const meds: Medication[] = [];
        snapshot.forEach((doc) => {
            meds.push({ id: doc.id, ...doc.data() } as Medication);
        });
        callback(meds);
    });
};

export const updateMedicationStatus = async (medicationId: string, status: 'Taken' | 'Skipped' | 'Scheduled') => {
    try {
        const medRef = doc(db, "medications", medicationId);

        // 1. Fetch the medication doc to get details for notification
        const medSnap = await getDoc(medRef);
        if (medSnap.exists()) {
            const medData = medSnap.data() as Medication;

            // 2. Update status
            await updateDoc(medRef, {
                status: status
            });

            // 3. If taken, notify Caretaker
            if (status === 'Taken' && medData.caretakerId) {
                // Ideally we would fetch Elder's name too, but for speed "Your Elder" works or we pass it.
                // Since this runs on Elder's device usually, we can say "Elder has taken..."
                await sendNotification(
                    medData.caretakerId, // To Caretaker
                    "Medication Taken",
                    `Medication ${medData.name} ${medData.dosage} has been marked as taken.`,
                    'success',
                    medData.elderId // From Elder
                );
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating medication status:", error);
        throw error;
    }
};

export const deleteAllMedications = async (elderId: string) => {
    try {
        const medsRef = collection(db, "medications");
        const q = query(medsRef, where("elderId", "==", elderId));
        const snapshot = await getDocs(q);

        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return { success: true };
    } catch (error) {
        console.error("Error deleting all medications:", error);
        throw error;
    }
};
