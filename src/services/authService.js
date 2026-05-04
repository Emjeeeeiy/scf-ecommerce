import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../Firebase/Firebase'
import { ensureUserProfile } from './userService'

export const loginUser = async (email, password) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  const profile = await ensureUserProfile(credentials.user)
  return {
    user: credentials.user,
    profile,
  }
}

export const registerUser = async (email, password, profileData) => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password)
  const profile = await ensureUserProfile(credentials.user, {
    ...profileData,
    role: 'customer'
  })
  return {
    user: credentials.user,
    profile,
  }
}

export const logoutUser = () => signOut(auth)
