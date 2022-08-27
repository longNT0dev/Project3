import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyAQqw_YN6yzAhj_4vXJUGn13Def8P_Hw48",
  authDomain: "mindxdemo.firebaseapp.com",
  projectId: "mindxdemo",
  storageBucket: "mindxdemo.appspot.com",
  messagingSenderId: "47905551824",
  appId: "1:47905551824:web:b0fc9af36dc8ee339d35d5",
});

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {
  db,
  storage,
  auth,
  ref,
  setDoc,
  uploadBytesResumable,
  collection,
  getDocs,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  doc,
  onAuthStateChanged,
  signOut,
  getDownloadURL,
  updateProfile,
  addDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy
};
