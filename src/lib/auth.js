import { PREVIEW_USER } from './constants.js'
import { isFirebaseConfigured, publicAppUrl } from './env.js'
import { firebaseAuth, googleProvider } from './firebase.js'
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

const previewStorageKey = 'fit-track-preview-session'
const emailStorageKey = 'fit-track-email-login'

function getRedirectBaseUrl() {
  return publicAppUrl || window.location.origin
}

async function resolveFirebaseSession() {
  if (!isFirebaseConfigured || !firebaseAuth) {
    return { session: null }
  }

  if (isSignInWithEmailLink(firebaseAuth, window.location.href)) {
    const storedEmail = window.localStorage.getItem(emailStorageKey)
    const email = storedEmail || window.prompt('Inserisci la tua email per completare l\'accesso')

    if (email) {
      await signInWithEmailLink(firebaseAuth, email, window.location.href)
      window.localStorage.removeItem(emailStorageKey)
      window.history.replaceState({}, document.title, '/dashboard')
    }
  }

  return {
    session: firebaseAuth.currentUser
      ? {
          user: firebaseAuth.currentUser,
        }
      : null,
  }
}

export async function getCurrentSession() {
  if (!isFirebaseConfigured) {
    const previewSession = window.localStorage.getItem(previewStorageKey)

    return {
      session: previewSession
        ? {
            user: PREVIEW_USER,
          }
        : null,
    }
  }

  return resolveFirebaseSession()
}

export async function signInWithProvider(provider) {
  if (!isFirebaseConfigured || !firebaseAuth) {
    return {
      error: new Error('Configura Firebase per abilitare il login social.'),
    }
  }

  if (provider !== 'google') {
    return {
      error: new Error('Provider non supportato. Usa Google.'),
    }
  }

  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider)

    return {
      data: { user: result.user },
      error: null,
    }
  } catch (error) {
    return {
      error,
    }
  }
}

export async function signInWithEmail(email) {
  if (!isFirebaseConfigured || !firebaseAuth) {
    return {
      error: new Error('Configura Firebase per abilitare il login con email.'),
    }
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return {
      error: new Error('Inserisci un indirizzo email valido.'),
    }
  }

  window.localStorage.setItem(emailStorageKey, normalizedEmail)

  const actionCodeSettings = {
    url: `${getRedirectBaseUrl()}/dashboard`,
    handleCodeInApp: true,
  }

  try {
    await sendSignInLinkToEmail(firebaseAuth, normalizedEmail, actionCodeSettings)

    return {
      data: { email: normalizedEmail },
      error: null,
    }
  } catch (error) {
    return {
      error,
    }
  }
}

export async function signOutUser() {
  if (!isFirebaseConfigured || !firebaseAuth) {
    window.localStorage.removeItem(previewStorageKey)
    return { error: null }
  }

  try {
    await signOut(firebaseAuth)

    return { error: null }
  } catch (error) {
    return { error }
  }
}

export function subscribeToAuthChanges(callback) {
  if (!isFirebaseConfigured || !firebaseAuth) {
    const handler = () => {
      callback(window.localStorage.getItem(previewStorageKey) ? { user: PREVIEW_USER } : null)
    }

    window.addEventListener('storage', handler)

    return {
      unsubscribe: () => window.removeEventListener('storage', handler),
    }
  }

  const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    callback(user ? { user } : null)
  })

  return { unsubscribe }
}

export function enablePreviewSession() {
  window.localStorage.setItem(previewStorageKey, 'active')
}