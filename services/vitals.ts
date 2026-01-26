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

export interface Vital {
    id: string;
    elderId: string;
    caretakerId: string;
    bpSystolic: string;
    bpDiastolic: string;
    bloodSugar: string;
    createdAt: Timestamp;
}

export const addVitalToFirestore = async (
    elderId: string,
    caretakerId: string,
    vitalData: { bpSystolic: string; bpDiastolic: string; bloodSugar: string }
) => {
    try {
        const vitalsRef = collection(db, "vitals");
        await addDoc(vitalsRef, {
            elderId,
            caretakerId,
            bpSystolic: vitalData.bpSystolic,
            bpDiastolic: vitalData.bpDiastolic,
            bloodSugar: vitalData.bloodSugar,
            createdAt: serverTimestamp()
        });

        // Notify Elder
        await sendNotification(
            elderId,
            "New Vitals Recorded",
            `Your caretaker added a reading: BP ${vitalData.bpSystolic}/${vitalData.bpDiastolic}, Sugar ${vitalData.bloodSugar} mg/dL.`,
            'info',
            caretakerId // Sender
        );

        return { success: true };
    } catch (error) {
        console.error("Error adding vital:", error);
        throw error;
    }
};

export const getVitalsRealtime = (elderId: string, callback: (vitals: Vital[]) => void) => {
    const vitalsRef = collection(db, "vitals");
    const q = query(
        vitalsRef,
        where("elderId", "==", elderId)
    );

    return onSnapshot(q, (snapshot) => {
        const vitals: Vital[] = [];
        snapshot.forEach((doc) => {
            vitals.push({ id: doc.id, ...doc.data() } as Vital);
        });

        // Client-side sort: Newest first
        vitals.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        callback(vitals);
    });
};
