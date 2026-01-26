import {
    addDoc,
    collection,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
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

        // Manual sort by time string if simple orderBy doesn't work well with "HH:mm AM/PM"
        // For MVP, simplistic sort or just returning is fine. 
        // Let's try to sort loosely by simple string comparison or leave it to UI.
        callback(meds);
    });
};
