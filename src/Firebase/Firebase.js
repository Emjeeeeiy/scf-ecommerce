import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import { getFirestore, serverTimestamp, Timestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyABOyaQ2XE-VVDwk2E36GonmKLkgQphwT0',
  authDomain: 'scf-app-4b684.firebaseapp.com',
  projectId: 'scf-app-4b684',
  storageBucket: 'scf-app-4b684.firebasestorage.app',
  messagingSenderId: '470973606342',
  appId: '1:470973606342:web:7c8411fe4e149dd6162ac7',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Set persistence to SESSION so it doesn't stay logged in forever across browser restarts
setPersistence(auth, browserSessionPersistence)
  .catch((err) => console.error("Auth persistence error:", err))

const db = getFirestore(app)

export { app, auth, db, serverTimestamp, Timestamp }