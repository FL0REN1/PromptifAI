import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC_6XFl_muvPcOe1-RA0KNlnOAU9K6nX_c",
    authDomain: "promtifai.firebaseapp.com",
    projectId: "promtifai",
    storageBucket: "promtifai.appspot.com",
    messagingSenderId: "820939422403",
    appId: "1:820939422403:web:dfe2bc4a09a9ec62f88076",
    measurementId: "G-7CTWX7453H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
