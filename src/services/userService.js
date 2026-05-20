import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'

const usersCollection = collection(db, 'users')

const buildDefaultProfile = (user, overrides = {}) => ({
  username: overrides.username || user.email?.split('@')[0] || `user-${user.uid.slice(0, 6)}`,
  email: user.email || '',
  firstName: overrides.firstName || '',
  lastName: overrides.lastName || '',
  contact: overrides.contact || '',
  address: overrides.address || '',
  role: overrides.role || 'customer',
  isStudent: overrides.isStudent || false,
  seenByAdmin: false,
  createdAt: serverTimestamp(),
})

export const mapProfile = (uid, data = {}) => ({
  id: uid,
  username: data.username || '',
  email: data.email || '',
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  contact: data.contact || '',
  address: data.address || '',
  role: data.role || 'customer',
  isStudent: data.isStudent || false,
  seenByAdmin: data.seenByAdmin || false,
  createdAt: data.createdAt || null,
})

export const ensureUserProfile = async (user, overrides = {}) => {
  const userRef = doc(usersCollection, user.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    await setDoc(userRef, buildDefaultProfile(user, overrides))
    const createdSnapshot = await getDoc(userRef)
    return mapProfile(createdSnapshot.id, createdSnapshot.data())
  }

  return mapProfile(snapshot.id, snapshot.data())
}

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(doc(usersCollection, uid))
  return snapshot.exists() ? mapProfile(snapshot.id, snapshot.data()) : null
}

export const updateUserProfile = async (uid, payload) => {
  const userRef = doc(usersCollection, uid)
  await updateDoc(userRef, payload)
  return getUserProfile(uid)
}

export const listAddresses = async (uid) => {
  const addressesRef = collection(db, 'users', uid, 'addresses')
  const addressesQuery = query(addressesRef, orderBy('createdAt', 'desc'))
  const snapshots = await getDocs(addressesQuery)

  return snapshots.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

export const addAddress = async (uid, payload) => {
  const addressesRef = collection(db, 'users', uid, 'addresses')
  const docRef = await addDoc(addressesRef, {
    ...payload,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export const deleteAddress = async (uid, addressId) => {
  await deleteDoc(doc(db, 'users', uid, 'addresses', addressId))
}

export const listAllUsers = async () => {
  const snapshots = await getDocs(query(usersCollection, orderBy('createdAt', 'desc')))
  return snapshots.docs.map((doc) => mapProfile(doc.id, doc.data()))
}

export const subscribeToAllUsers = (callback) => {
  const q = query(usersCollection, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc) => mapProfile(doc.id, doc.data()))
    callback(users)
  })
}

export const subscribeToUnseenUsersCount = (callback) => {
  const q = query(usersCollection, where('seenByAdmin', '==', false))
  return onSnapshot(q, 
    (snapshot) => {
      console.log(`[UserNotification] Unseen count update: ${snapshot.size}`)
      callback(snapshot.size)
    },
    (error) => {
      console.error("Firestore User Notification Error:", error.code, error.message)
    }
  )
}

export const markUserAsSeen = async (uid) => {
  const userRef = doc(usersCollection, uid)
  await updateDoc(userRef, {
    seenByAdmin: true,
  })
}

export const deleteUser = async (uid) => {
  await deleteDoc(doc(usersCollection, uid))
}
