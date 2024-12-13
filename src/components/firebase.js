import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyBQJolHDKomkfy1y4qIKy9MFe-foGMtYyo",
    authDomain: "alteroffice-697ea.firebaseapp.com",
    projectId: "alteroffice-697ea",
    storageBucket: "alteroffice-697ea.firebasestorage.app",
    messagingSenderId: "276322683369",
    appId: "1:276322683369:web:0191d158b1a8704773e378"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app)
export default app;
