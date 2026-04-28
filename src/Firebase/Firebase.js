import { initializeApp } from "firebase/app"

// AUTH
import { getAuth } from "firebase/auth"

// FIRESTORE
import { getFirestore } from "firebase/firestore"

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyABOyaQ2XE-VVDwk2E36GonmKLkgQphwT0",
  authDomain: "scf-app-4b684.firebaseapp.com",
  projectId: "scf-app-4b684",
  storageBucket: "scf-app-4b684.firebasestorage.app",
  messagingSenderId: "470973606342",
  appId: "1:470973606342:web:7c8411fe4e149dd6162ac7"
}

// Init Firebase
const app = initializeApp(firebaseConfig)

// Services
const auth = getAuth(app)
const db = getFirestore(app)

// Export BOTH
export { auth, db }