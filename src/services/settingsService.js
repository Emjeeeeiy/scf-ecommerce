import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'

const SETTINGS_DOC_ID = 'landingPage'
const settingsDoc = doc(db, 'settings', SETTINGS_DOC_ID)

export const DEFAULT_LANDING_PAGE_SETTINGS = {
  hero: {
    title: 'SCF',
    description: 'Silangan Christian Fellowship is a community of believers dedicated to sharing the love of Christ and serving our local community.',
    logoUrl: '/scfLogo.png'
  },
  mission: {
    title: 'Our Mission',
    description: 'To create meaningful, high-quality apparel that sparks conversation about Christ while generating the resources necessary to serve our local community and expand our ministry.'
  },
  vision: {
    title: 'Our Vision',
    description: 'To see a community transformed by the Gospel, where every member is equipped to share their faith and every person in need is supported by the hands and feet of Silangan Christian Fellowship.'
  },
  about: {
    title: 'About SCF',
    description: "Silangan Christian Fellowship started with a small group of believers committed to making a difference. Our fundraising shop isn't just about merchandise—it's a creative outlet for our members to design shirts that reflect our values. 100% of the proceeds go directly into our building fund and outreach projects."
  },
  contact: {
    email: 'hello@silanganchristian.org',
    address: 'Silangan, Philippines',
    facebook: 'https://www.facebook.com/scfellowsh1p'
  }
}

const PAYMENT_SETTINGS_DOC_ID = 'paymentSettings'
const paymentSettingsDoc = doc(db, 'settings', PAYMENT_SETTINGS_DOC_ID)

export const DEFAULT_PAYMENT_SETTINGS = {
  gcash: {
    qrCodeBase64: '',
    accountName: '',
    accountNumber: ''
  }
}

export const getPaymentSettings = async () => {
  const snapshot = await getDoc(paymentSettingsDoc)
  if (snapshot.exists()) {
    return snapshot.data()
  }
  return DEFAULT_PAYMENT_SETTINGS
}

export const savePaymentSettings = async (settings) => {
  await setDoc(paymentSettingsDoc, settings, { merge: true })
}

export const getLandingPageSettings = async () => {
  const snapshot = await getDoc(settingsDoc)
  if (snapshot.exists()) {
    return snapshot.data()
  }
  return DEFAULT_LANDING_PAGE_SETTINGS
}

export const saveLandingPageSettings = async (settings) => {
  await setDoc(settingsDoc, settings, { merge: true })
}
