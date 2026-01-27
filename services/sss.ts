import {
    addDoc,
    collection,
    getDocs,
    limit,
    query,
    serverTimestamp,
    Timestamp,
    where
} from "firebase/firestore";
import { db } from "../configs/firebase";

export interface SSSApplication {
    id: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    sssNumber: string;
    bankName: string;
    bankAccountNumber: string;
    dateOfBirth: Timestamp;
    submittedAt: Timestamp;
}

export const submitPensionApplication = async (
    userId: string,
    sssNumber: string,
    bankName: string,
    bankAccountNumber: string,
    dateOfBirth: Date
) => {
    try {
        const applicationsRef = collection(db, "sss_applications");

        // Check for existing pending application
        const q = query(
            applicationsRef,
            where("userId", "==", userId),
            where("status", "==", "pending")
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("You already have a pending application.");
        }

        await addDoc(applicationsRef, {
            userId,
            status: 'pending',
            sssNumber,
            bankName,
            bankAccountNumber,
            dateOfBirth: Timestamp.fromDate(dateOfBirth),
            submittedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error submitting SSS application:", error);
        throw error;
    }
};

export const getPensionApplicationStatus = async (userId: string): Promise<SSSApplication | null> => {
    try {
        const applicationsRef = collection(db, "sss_applications");
        const q = query(
            applicationsRef,
            where("userId", "==", userId),
            limit(1)
        ); // Get the most recent one ideally, but for now just one

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as SSSApplication;
    } catch (error) {
        console.error("Error fetching SSS application:", error);
        throw error;
    }
};
