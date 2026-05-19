import { createContext, useContext, useEffect, useState } from 'react'
import {
  enablePreviewSession,
  getCurrentSession,
  signInWithEmail,
  signInWithProvider,
  signOutUser,
  subscribeToAuthChanges,
} from '../lib/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getCurrentSession()
      .then((data) => {
        if (mounted) {
          setSession(data.session)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    const subscription = subscribeToAuthChanges((nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    loading,
    session,
    user: session?.user ?? null,
    login: signInWithProvider,
    loginWithEmail: signInWithEmail,
    logout: signOutUser,
    enablePreview: () => {
      enablePreviewSession()
      setSession({ user: { id: 'preview-user' } })
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider.')
  }

  return context
}