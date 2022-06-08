import { initializeApp } from "firebase/app";
import { getFirestore,doc,setDoc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

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

export { db, storage, auth, ref, doc, setDoc };
