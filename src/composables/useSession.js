import { computed, readonly, ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Firebase/Firebase'
import { ensureUserProfile } from '../services/userService'

const authUser = ref(null)
const profile = ref(null)
const sessionReady = ref(false)
let initialized = false
let readyPromise

export const initSessionObserver = () => {
  if (initialized) {
    return readyPromise
  }

  initialized = true

  readyPromise = new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      authUser.value = user

      if (user) {
        profile.value = await ensureUserProfile(user)
      } else {
        profile.value = null
      }

      sessionReady.value = true
      resolve()
    })
  })

  return readyPromise
}

export const waitForSessionReady = async () => {
  await initSessionObserver()

  if (!sessionReady.value) {
    await readyPromise
  }
}

export const useSession = () => ({
  authUser: readonly(authUser),
  profile: readonly(profile),
  sessionReady: readonly(sessionReady),
  isAuthenticated: computed(() => Boolean(authUser.value)),
  isAdmin: computed(() => profile.value?.role === 'admin'),
})
