// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase Authentication
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABOyaQ2XE-VVDwk2E36GonmKLkgQphwT0",
  authDomain: "scf-app-4b684.firebaseapp.com",
  projectId: "scf-app-4b684",
  storageBucket: "scf-app-4b684.firebasestorage.app",
  messagingSenderId: "470973606342",
  appId: "1:470973606342:web:7c8411fe4e149dd6162ac7"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Export Auth
export { auth }