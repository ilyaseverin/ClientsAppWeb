// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHwdAvv5yEBQRfKFzpyv_SVb51mYYtDVc",
  authDomain: "clientsapp-11fbe.firebaseapp.com",
  projectId: "clientsapp-11fbe",
  storageBucket: "clientsapp-11fbe.firebasestorage.app",
  messagingSenderId: "443579523746",
  appId: "1:443579523746:web:75edc958f537c5caff6dfb",
  measurementId: "G-YBCNEZ6EPR",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
