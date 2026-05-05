import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
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
