import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export {
  collection, doc, setDoc, addDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp
};
