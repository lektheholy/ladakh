// ===================================================
// firebase.js — Firebase config + Auth + Firestore + Storage
// ===================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
         GoogleAuthProvider, signInWithPopup }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc, orderBy, query }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFuMPVoy0jUamQtAFyTF_xZipjqjomEto",
  authDomain: "ladakh-l.firebaseapp.com",
  projectId: "ladakh-l",
  storageBucket: "ladakh-l.firebasestorage.app",
  messagingSenderId: "730812029375",
  appId: "1:730812029375:web:6e7f4907d4dff40f71290a",
  measurementId: "G-58SK2SMS4D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ── Auth helpers ──────────────────────────────────
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
export async function logout() {
  return signOut(auth);
}
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
export function currentUser() {
  return auth.currentUser;
}

// ── Firestore helpers ─────────────────────────────

/** อ่านเอกสารเดี่ยว */
export async function getDocument(path) {
  const snap = await getDoc(doc(db, ...path.split("/")));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** บันทึก/อัพเดตเอกสารเดี่ยว */
export async function setDocument(path, data) {
  await setDoc(doc(db, ...path.split("/")), data, { merge: true });
}

/** อ่าน collection ทั้งหมด */
export async function getCollection(colPath) {
  const q = query(collection(db, colPath));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** เพิ่ม document ใหม่ใน collection (auto-id) */
export async function addDocument(colPath, data) {
  return addDoc(collection(db, colPath), { ...data, createdAt: Date.now() });
}

/** ลบ document */
export async function deleteDocument(path) {
  await deleteDoc(doc(db, ...path.split("/")));
}

/** อัพเดต document */
export async function updateDocument(path, data) {
  await updateDoc(doc(db, ...path.split("/")), data);
}

// ── Storage helpers ───────────────────────────────

/**
 * อัปโหลดไฟล์ไปยัง Firebase Storage
 * @param {string} storagePath  เช่น "certificates/award_123.jpg"
 * @param {File}   file         File object จาก <input type="file">
 * @returns {Promise<string>}   Download URL
 */
export async function uploadFile(storagePath, file) {
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/**
 * ลบไฟล์จาก Storage (ถ้ามี URL)
 * @param {string} downloadURL  URL ที่ได้จาก getDownloadURL
 */
export async function deleteFileByURL(downloadURL) {
  try {
    const storageRef = ref(storage, downloadURL);
    await deleteObject(storageRef);
  } catch(e) { /* ignore if not found */ }
}
