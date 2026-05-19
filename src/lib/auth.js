import { PREVIEW_USER } from './constants.js'
import { isSupabaseConfigured, publicAppUrl } from './env.js'
import { supabase } from './supabaseClient.js'

const previewStorageKey = 'fit-track-preview-session'

function getRedirectBaseUrl() {
  return publicAppUrl || window.location.origin
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) {
    const previewSession = window.localStorage.getItem(previewStorageKey)

    return {
      session: previewSession
        ? {
            user: PREVIEW_USER,
          }
        : null,
    }
  }

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data
}

export async function signInWithProvider(provider) {
  if (!isSupabaseConfigured) {
    return {
      error: new Error('Configura Supabase per abilitare il login social.'),
    }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getRedirectBaseUrl()}/dashboard`,
    },
  })

  return { data, error }
}

export async function signInWithEmail(email) {
  if (!isSupabaseConfigured) {
    return {
      error: new Error('Configura Supabase per abilitare il login con email.'),
    }
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return {
      error: new Error('Inserisci un indirizzo email valido.'),
    }
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: `${getRedirectBaseUrl()}/dashboard`,
    },
  })

  return { data, error }
}

export async function signOutUser() {
  if (!isSupabaseConfigured) {
    window.localStorage.removeItem(previewStorageKey)
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()

  return { error }
}

export function subscribeToAuthChanges(callback) {
  if (!isSupabaseConfigured) {
    const handler = () => {
      callback(window.localStorage.getItem(previewStorageKey) ? { user: PREVIEW_USER } : null)
    }

    window.addEventListener('storage', handler)

    return {
      unsubscribe: () => window.removeEventListener('storage', handler),
    }
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return subscription
}

export function enablePreviewSession() {
  window.localStorage.setItem(previewStorageKey, 'active')
}