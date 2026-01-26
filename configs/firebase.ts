// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// @ts-ignore
import { getReactNativePersistence } from "@firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth } from "firebase/auth";

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



// Initialize Auth with persistence
// This tells Firebase to save the user's login token to the phone's storage
import { Auth, getAuth } from "firebase/auth";

let auth: Auth;
try {
    // Try to get existing auth instance to prevent "auth/already-initialized" error on hot reload
    auth = getAuth(app);
} catch (e) {
    // If not initialized, initialize it with persistence
    auth = initializeAuth(app, {
        // @ts-ignore: getReactNativePersistence is missing from type definitions but exists at runtime
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

export { auth };



// Use initializeFirestore to force long polling, which is more robust for some networks

// Only apply experimentalForceLongPolling on Android where it's most needed

export const db = Platform.OS === 'android'

    ? initializeFirestore(app, { experimentalForceLongPolling: true })

    : getFirestore(app);