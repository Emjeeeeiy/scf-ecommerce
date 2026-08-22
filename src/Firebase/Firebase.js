import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import { getFirestore, serverTimestamp, Timestamp } from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Set persistence to SESSION so it doesn't stay logged in forever across browser restarts
setPersistence(auth, browserSessionPersistence)
  .catch((err) => console.error("Auth persistence error:", err))

const db = getFirestore(app)

// Safely initialize messaging
let messaging = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app)
    }
  }).catch((err) => {
    console.warn("FCM isSupported check failed:", err)
  })
}

export { app, auth, db, messaging, serverTimestamp, Timestamp }
