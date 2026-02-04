import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { sendNotification } from './notification';

export interface Appointment {
    id: string;
    elderId: string;
    caretakerId: string;
    patientName: string;
    age: string;
    gender: string;
    doctorName: string;
    clinicName: string;
    clinicAddress: string;
    date: string; // e.g., "10/25/2023"
    time: string; // e.g., "10:00 AM"
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    createdAt: any;
}

export const addAppointmentToFirestore = async (
    elderId: string,
    caretakerId: string,
    appointmentData: {
        patientName: string,
        age: string,
        gender: string,
        doctorName: string,
        clinicName: string,
        clinicAddress: string,
        date: string,
        time: string
    }
) => {
    try {
        const appointmentsRef = collection(db, "appointments");

        const docRef = await addDoc(appointmentsRef, {
            elderId,
            caretakerId,
            ...appointmentData,
            status: 'Scheduled',
            createdAt: serverTimestamp()
        });

        // Notify Elder
        await sendNotification(
            elderId,
            "New Doctor Appointment",
            `Appointment with ${appointmentData.doctorName} on ${appointmentData.date} at ${appointmentData.time}.`,
            'info',
            caretakerId
        );

        return docRef.id;
    } catch (error) {
        console.error("Error adding appointment: ", error);
        throw error;
    }
};

export const getAppointmentsRealtime = (userId: string, callback: (appointments: Appointment[]) => void) => {
    const appointmentsRef = collection(db, "appointments");
    // Query where elderId matches OR caretakerId matches (so both can see it)
    // For now, let's assume valid usage is querying by Elder ID mostly.

    // Simple query: get appointments for this user (assuming it's the elder)
    // Removing orderBy("createdAt", "desc") to avoid "failed-precondition" index error
    // We will sort client-side instead.
    const q = query(
        appointmentsRef,
        where("elderId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const appointments: Appointment[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Appointment));

        // Sort client-side
        appointments.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA; // Descending
        });

        callback(appointments);
    });
};
export const updateAppointmentStatus = async (appointmentId: string, status: 'Scheduled' | 'Completed' | 'Cancelled') => {
    try {
        const appointmentRef = doc(db, "appointments", appointmentId);
        await updateDoc(appointmentRef, {
            status: status
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating appointment status:", error);
        throw error;
    }
};
