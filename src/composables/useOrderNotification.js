import { ref, watch } from 'vue'
import { subscribeToUnseenOrdersCount } from '../services/orderService'
import { useSession } from './useSession'
import { app, db } from '../Firebase/Firebase'
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const unseenOrdersCount = ref(0)
let unsubscribe = null
let newOrderUnsubscribe = null

// Helper: Get messaging instance safely
const getSafeMessaging = async () => {
  if (typeof window === 'undefined') return null
  try {
    const supported = await isSupported()
    if (supported) {
      return getMessaging(app)
    }
  } catch (err) {
    console.warn('[FCM] Error checking FCM support:', err)
  }
  return null
}

// Helper: Request local Notification permission
const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }
  if (Notification.permission === 'granted') {
    return true
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

// Helper: Trigger browser notification
const triggerBrowserNotification = (title, options) => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options
    })
    notification.onclick = () => {
      window.focus()
    }
  }
}

// Helper: Register service worker and get FCM token
const registerFCM = async (userId) => {
  if (typeof window === 'undefined' || !('navigator' in window) || !('serviceWorker' in navigator)) {
    console.warn('[FCM] Service workers are not supported in this browser.')
    return
  }

  const messagingInstance = await getSafeMessaging()
  if (!messagingInstance) {
    console.warn('[FCM] Firebase Messaging is not supported or initialized.')
    return
  }

  try {
    // Register the firebase-messaging-sw.js service worker
    console.log('[FCM] Registering Service Worker...')
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    })
    console.log('[FCM] Service Worker registered:', registration)

    // Request browser notification permission
    const permission = await requestNotificationPermission()
    if (!permission) {
      console.warn('[FCM] Browser notification permission denied.')
      return
    }

    // Retrieve FCM Token
    // We attempt to get the token, allowing user to customize VAPID key via environment variable if needed
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BKYS8IVJn0LuS0HGOexPZkpfDd4uCsaAVDgd7ae_G75lskLZls5XN4aN3XMwBJTmsU-g9kP-kBTaZ_bVETv8KwQ'
    console.log('[FCM] Retrieving token...')
    const token = await getToken(messagingInstance, {
      serviceWorkerRegistration: registration,
      vapidKey
    })

    if (token) {
      console.log('[FCM] FCM Token retrieved:', token)
      // Save the token to the admin user's profile in Firestore
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token)
      })
      console.log('[FCM] Token successfully registered in Firestore user document.')
    } else {
      console.warn('[FCM] No registration token available. Request permission to generate one.')
    }
  } catch (error) {
    console.error('[FCM] Error setting up FCM:', error)
  }
}

export const useOrderNotification = () => {
  const { isAdmin, isAuthenticated, profile } = useSession()

  const startSubscription = () => {
    if (unsubscribe) return
    console.log('[OrderNotification] Starting Firestore unseen count subscription...')
    unsubscribe = subscribeToUnseenOrdersCount((count) => {
      unseenOrdersCount.value = count
    })
  }

  const stopSubscription = () => {
    if (unsubscribe) {
      console.log('[OrderNotification] Stopping Firestore unseen count subscription.')
      unsubscribe()
      unsubscribe = null
      unseenOrdersCount.value = 0
    }
  }

  const startNewOrderListener = () => {
    if (newOrderUnsubscribe) return
    console.log('[OrderNotification] Starting new order real-time listener...')

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5))
    let isInitial = true

    newOrderUnsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitial) {
        isInitial = false
        return
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const orderData = change.doc.data()
          const customerName = orderData.customerDetails
            ? `${orderData.customerDetails.firstName} ${orderData.customerDetails.lastName}`
            : 'Guest'
          const totalAmount = orderData.totalAmount || 0

          triggerBrowserNotification("New Order Placed!", {
            body: `Order by ${customerName} for ₱${totalAmount.toLocaleString()}`,
            tag: change.doc.id
          })
        }
      })
    }, (error) => {
      console.error("[OrderNotification] New order listener error:", error)
    })
  }

  const stopNewOrderListener = () => {
    if (newOrderUnsubscribe) {
      console.log('[OrderNotification] Stopping new order real-time listener.')
      newOrderUnsubscribe()
      newOrderUnsubscribe = null
    }
  }

  const syncSubscription = () => {
    if (isAdmin.value && isAuthenticated.value) {
      // Make sure browser permission is requested
      requestNotificationPermission()

      startSubscription()
      startNewOrderListener()

      // Set up FCM
      if (profile.value?.id) {
        registerFCM(profile.value.id)
      }
    } else {
      stopSubscription()
      stopNewOrderListener()
    }
  }

  // Watch for session changes
  watch(
    [isAdmin, isAuthenticated, profile],
    () => {
      syncSubscription()
    },
    { immediate: true }
  )

  return {
    unseenOrdersCount,
    stopSubscription,
    startSubscription
  }
}


