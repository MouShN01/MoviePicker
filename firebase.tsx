// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth, EmailAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI0PQqxVcrHne7KWMs5gZjKCMMcWo0Jfg",
  authDomain: "moviepicker-23e95.firebaseapp.com",
  projectId: "moviepicker-23e95",
  storageBucket: "moviepicker-23e95.firebasestorage.app",
  messagingSenderId: "493070271518",
  appId: "1:493070271518:web:eb1170b8f4ec31ba5f1a0f",
  measurementId: "G-NGKCV637MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const provider = new EmailAuthProvider();

export {app, auth, provider, db}