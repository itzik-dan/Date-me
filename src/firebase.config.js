import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBc75cCKwfnXEwRlw_PhwO_KSynjcqKQAU",
  authDomain: "date-me-8ff2c.firebaseapp.com",
  projectId: "date-me-8ff2c",
  storageBucket: "date-me-8ff2c.appspot.com",
  messagingSenderId: "834614199463",
  appId: "1:834614199463:web:5e0f0a5fa4e90a4006c782",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
