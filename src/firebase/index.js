// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWEN5OoU5k72zSW8_ExyjT3DuaJZJP6lI",
  authDomain: "appvisitas-58c0f.firebaseapp.com",
  projectId: "appvisitas-58c0f",
  storageBucket: "appvisitas-58c0f.appspot.com",
  messagingSenderId: "395235742313",
  appId: "1:395235742313:web:d178e20ec6892e970e08f8",
  measurementId: "G-QJCEXEH9MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const currentUser = auth.currentUser
const db = getFirestore(app)



export { auth, currentUser, db}