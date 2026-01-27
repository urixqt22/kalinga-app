import {
    addDoc,
    collection,
    doc,
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
        await updateDoc(medRef, {
            status: status
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating medication status:", error);
        throw error;
    }
};
