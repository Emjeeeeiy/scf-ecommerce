import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
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

export const registerUser = async ({
  email,
  password,
  username,
  firstName,
  lastName,
  contact,
}) => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password)

  const profile = await ensureUserProfile(credentials.user, {
    username,
    firstName,
    lastName,
    contact,
    role: 'customer',
  })

  return {
    user: credentials.user,
    profile,
  }
}

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const credentials = await signInWithPopup(auth, provider)

  const names = credentials.user.displayName?.trim().split(/\s+/) || []
  const firstName = names[0] || ''
  const lastName = names.slice(1).join(' ')

  const profile = await ensureUserProfile(credentials.user, {
    username: credentials.user.email?.split('@')[0] || credentials.user.displayName || '',
    firstName,
    lastName,
    role: 'customer',
  })

  return {
    user: credentials.user,
    profile,
  }
}

export const logoutUser = () => signOut(auth)
