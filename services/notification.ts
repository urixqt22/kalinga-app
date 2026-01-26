import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    where
} from "firebase/firestore";
import { db } from "../configs/firebase";

export interface AppNotification {
    id: string;
    userId: string;
    senderId?: string; // ID of the person who triggered this
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    createdAt: Timestamp;
}

export const sendNotification = async (userId: string, title: string, message: string, type: 'info' | 'alert' | 'success' = 'info', senderId?: string) => {
    try {
        const notifsRef = collection(db, "notifications");
        await addDoc(notifsRef, {
            userId,
            title,
            message,
            type,
            senderId: senderId || null,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        // We don't throw here to avoid blocking the main action (e.g. adding med)
    }
};

export const getNotifications = (userId: string, callback: (notifs: AppNotification[]) => void) => {
    const notifsRef = collection(db, "notifications");
    const q = query(
        notifsRef,
        where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const notifs: AppNotification[] = [];
        snapshot.forEach((doc) => {
            notifs.push({ id: doc.id, ...doc.data() } as AppNotification);
        });

        // Client-side sort: Newest first
        notifs.sort((a, b) => {
            // Handle possible missing timestamps or convert if needed
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        callback(notifs);
    }, (error) => {
        console.error("Error fetching notifications:", error);
    });
};

export const markAsDone = async (notificationId: string, replyToId?: string, replyMessage?: string) => {
    try {
        // 1. Delete the original notification
        const notifRef = doc(db, "notifications", notificationId);
        await deleteDoc(notifRef);

        // 2. If a reply is required (Acknowledgment), send it
        if (replyToId && replyMessage) {
            await sendNotification(
                replyToId,
                "Activity Acknowledged",
                replyMessage,
                'success'
            );
        }
    } catch (error) {
        console.error("Error marking notification as done:", error);
        throw error;
    }
};
