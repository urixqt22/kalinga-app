// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOUR OWN FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyD-530UfAjLf3KZPVutyy_PKcD1xrzwayI",
    authDomain: "kalinga-app.firebaseapp.com",
    projectId: "kalinga-app",
    storageBucket: "kalinga-app.firebasestorage.app",
    messagingSenderId: "296061886226",
    appId: "1:296061886226:web:2579cce56914f1d10a9dcb",
    measurementId: "G-X424ZG3SW0"
};

import { Platform } from "react-native";

// Initialize Firebase
console.log("Initializing Firebase with API Key:", firebaseConfig.apiKey);
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use initializeFirestore to force long polling, which is more robust for some networks
// Only apply experimentalForceLongPolling on Android where it's most needed
export const db = Platform.OS === 'android'
    ? initializeFirestore(app, { experimentalForceLongPolling: true })
    : getFirestore(app);
