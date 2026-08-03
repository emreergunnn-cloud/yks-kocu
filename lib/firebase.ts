import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe9AYhowb3XxIE14abVa-Jk9Hjhluz7c0",
  authDomain: "yks-kocu-cfd78.firebaseapp.com",
  projectId: "yks-kocu-cfd78",
  storageBucket: "yks-kocu-cfd78.firebasestorage.app",
  messagingSenderId: "551440834645",
  appId: "1:551440834645:web:0d163a003bf9b63fc5f4dc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);