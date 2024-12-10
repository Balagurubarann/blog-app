// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "blog-app-f3bcf.firebaseapp.com",
  projectId: "blog-app-f3bcf",
  storageBucket: "blog-app-f3bcf.firebasestorage.app",
  messagingSenderId: "515209157569",
  appId: "1:515209157569:web:6c111c89482abaae0a6d40"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);