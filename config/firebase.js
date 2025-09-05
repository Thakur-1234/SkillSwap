import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth (memory persistence only)
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);
