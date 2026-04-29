import {
  signInWithEmailAndPassword,
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

export const logoutUser = () => signOut(auth)
