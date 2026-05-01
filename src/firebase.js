import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyButZZ5BroDEyaVmeW_r-_RqE_ymx8hCN8",
  authDomain: "expense-tracker-6072c.firebaseapp.com",
  projectId: "expense-tracker-6072c",
  storageBucket: "expense-tracker-6072c.firebasestorage.app",
  messagingSenderId: "804648186309",
  appId: "1:804648186309:web:945229122eedb3846c5bac",
  measurementId: "G-10SSDTQ5GZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);