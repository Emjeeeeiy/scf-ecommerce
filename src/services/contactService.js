import { addDoc, collection } from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'

export const submitContactMessage = async ({ name, email, message }) => {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new Error('Please fill in your name, email, and message.')
  }

  await addDoc(collection(db, 'contactMessages'), {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  })
}
