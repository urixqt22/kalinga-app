import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../configs/firebase";

export interface FamilyContact {
    id: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    isOnline: boolean; // For now this might be mocked or manual
    createdAt: Timestamp;
}

export const addFamilyContact = async (
    userId: string,
    name: string,
    relationship: string,
    phoneNumber: string
) => {
    try {
        const docRef = await addDoc(collection(db, "users", userId, "family_contacts"), {
            name,
            relationship,
            phoneNumber,
            isOnline: true, // Default to true or arbitrary for now
            createdAt: serverTimestamp(),
        });
        console.log("Family contact added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding family contact: ", e);
        throw e;
    }
};

export const getFamilyContactsRealtime = (userId: string, onUpdate: (contacts: FamilyContact[]) => void) => {
    const q = query(
        collection(db, "users", userId, "family_contacts"),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const contacts: FamilyContact[] = [];
        querySnapshot.forEach((doc) => {
            contacts.push({ id: doc.id, ...doc.data() } as FamilyContact);
        });
        onUpdate(contacts);
    });

    return unsubscribe;
};

export const deleteFamilyContact = async (userId: string, contactId: string) => {
    try {
        await deleteDoc(doc(db, "users", userId, "family_contacts", contactId));
    } catch (e) {
        console.error("Error deleting contact: ", e);
        throw e;
    }
};
