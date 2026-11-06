import { addDoc, collection } from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

// Emails the message through Web3Forms. It is designed to be called from the
// browser and its access key is public; mail goes to the inbox the key was
// created with, and the sender's `email` becomes the Reply-To.
const sendContactEmail = async ({ name, email, message }) => {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  if (!accessKey) {
    console.error('Contact form: VITE_WEB3FORMS_ACCESS_KEY is not set (see .env.example).')
    throw new Error('The contact form is not available right now. Please email us directly.')
  }

  let response
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New message from ${name} — SCF website`,
        from_name: 'SCF Website',
        name,
        email,
        message,
      }),
    })
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.')
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) {
    // 200/400 responses nest the message under `body`; 429 puts it at the top level.
    console.error('Contact form: Web3Forms rejected the message:', result.body?.message || result.message || response.status)
    if (response.status === 429) {
      throw new Error('Too many messages right now. Please try again in a few minutes.')
    }
    throw new Error('We couldn’t send your message. Please try again or email us directly.')
  }
}

export const submitContactMessage = async ({ name, email, message }) => {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new Error('Please fill in your name, email, and message.')
  }

  const entry = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  }

  await sendContactEmail(entry)

  // Keep a copy in Firestore as a record. The email already went out, so a
  // failed save (e.g. rules not deployed) is logged rather than reported.
  try {
    await addDoc(collection(db, 'contactMessages'), {
      ...entry,
      status: 'new',
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.warn('Contact message was emailed but not saved to Firestore:', error)
  }
}
