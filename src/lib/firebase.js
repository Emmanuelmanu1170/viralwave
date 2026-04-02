import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvdpKnrpZXRDzwHfOb943ANZK4ufDHuD4",
  authDomain: "viralwave-5029f.firebaseapp.com",
  projectId: "viralwave-5029f",
  storageBucket: "viralwave-5029f.firebasestorage.app",
  messagingSenderId: "100976371815",
  appId: "1:100976371815:web:5cf0e62c888d5b8159ccc2",
  measurementId: "G-XD7K3XRRHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services so we can use them in LoginPage and Dashboard
export const auth = getAuth(app);
export const db = getFirestore(app);