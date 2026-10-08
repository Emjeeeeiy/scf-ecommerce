import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'

const SETTINGS_DOC_ID = 'landingPage'
const settingsDoc = doc(db, 'settings', SETTINGS_DOC_ID)

export const DEFAULT_LANDING_PAGE_SETTINGS = {
  hero: {
    title: 'Silangan Christian Fellowship',
    description: 'Silangan Christian Fellowship is a community of believers dedicated to sharing the love of Christ and serving our local community.'
  },
  mission: {
    title: 'Our Mission',
    description: 'To create meaningful, high-quality apparel that sparks conversation about Christ while generating the resources necessary to serve our local community and expand our ministry.'
  },
  vision: {
    title: 'Our Vision',
    description: 'To see a community transformed by the Gospel, where every member is equipped to share their faith and every person in need is supported by the hands and feet of Silangan Christian Fellowship.'
  },
  officers: {
    title: 'SLC Officers',
    members: [
      { name: 'Juan Dela Cruz', position: 'President', photoBase64: '' },
      { name: 'Maria Santos', position: 'Vice President', photoBase64: '' },
      { name: 'Jose Reyes', position: 'Secretary', photoBase64: '' },
      { name: 'Ana Bautista', position: 'Treasurer', photoBase64: '' },
      { name: 'Mark Villanueva', position: 'Auditor', photoBase64: '' },
    ]
  },
  basisOfFaith: {
    title: 'Basis of Faith',
    points: [
      'The unity of the Father, Son and Holy Spirit in the Godhead.',
      'The sovereignty of God in creation, revelation, redemption and final judgment.',
      'The divine inspiration and the entire trustworthiness of the Holy Scriptures, as originally given, and its supreme authority in all matters of faith and conduct.',
      'The universal sinfulness and guilt of all men since the fall, rendering them subject to God\u2019s wrath and condemnation.',
      'Redemption from the guilt, penalty, dominion and pollution of sin, solely through the sacrificial death (as our Representative and Substitute) of the Lord Jesus Christ, the Incarnate Son of God.',
      'The bodily resurrection of the Lord Jesus Christ from the dead and His ascension to the right hand of God the Father.',
      'The presence and power of the Holy Spirit in the work of regeneration.',
      'The justification of the sinner by the grace of God through faith alone.',
      'The indwelling and work of the Holy Spirit in the believer.',
      'The one Holy Universal Church which is the Body of Christ and to which all true believers belong.',
      'The expectation of the personal return of the Lord Jesus Christ.',
    ]
  },
  about: {
    title: 'About SCF',
    description: "Silangan Christian Fellowship started with a small group of believers committed to making a difference. Our fundraising shop isn't just about merchandise—it's a creative outlet for our members to design shirts that reflect our values. 100% of the proceeds go directly into our building fund and outreach projects."
  },
  contact: {
    email: 'hello@silanganchristian.org',
    address: 'Silangan, Philippines',
    facebook: 'https://www.facebook.com/scfellowsh1p',
    title: 'Get in touch',
    intro: 'Have questions about your order, sizing, or how to get involved with SCF? We\u2019d love to hear from you.'
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
