import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../configs/firebase";

export const registerSenior = async (email: string, password: string, additionalData: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            role: 'SENIOR',
            ...additionalData, // name, contact, etc.
            createdAt: new Date()
        });

        return user;
    } catch (error) {
        throw error;
    }
};

export const registerCaretaker = async (email: string, password: string, additionalData: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            role: 'CARETAKER',
            ...additionalData,
            createdAt: new Date()
        });

        return user;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

import { getDoc, getDocFromServer } from "firebase/firestore";

export const getUserRole = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        let docSnap;

        try {
            // Try to fetch from server first to bypass potential cache/offline issues
            docSnap = await getDocFromServer(docRef);
        } catch (e) {
            console.warn("getDocFromServer failed, falling back to getDoc:", e);
            // Fallback to default behavior (cache then server)
            docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
            return docSnap.data().role;
        } else {
            console.error("No user document found for uid:", uid);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
        throw error;
    }
};

import { collection, getDocs, query, where } from "firebase/firestore";

export const getEmailByName = async (name: string) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("name", "==", name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Return the email of the first matching user
            return querySnapshot.docs[0].data().email;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting email by name:", error);
        return null;
    }
};
