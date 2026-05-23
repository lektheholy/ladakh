// ===== FIREBASE CONFIG & SHARED HELPERS =====
// ไฟล์นี้ใช้ร่วมกันระหว่าง index.html และ admin.html

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, addDoc, setDoc, deleteDoc, query, orderBy }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAFuMPVoy0jUamQtAFyTF_xZipjqjomEto",
  authDomain:        "ladakh-l.firebaseapp.com",
  projectId:         "ladakh-l",
  storageBucket:     "ladakh-l.firebasestorage.app",
  messagingSenderId: "730812029375",
  appId:             "1:730812029375:web:6e7f4907d4dff40f71290a",
  measurementId:     "G-58SK2SMS4D"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, GoogleAuthProvider,
         signInWithPopup, signOut, onAuthStateChanged,
         collection, doc, getDocs, addDoc, setDoc, deleteDoc, query, orderBy };
