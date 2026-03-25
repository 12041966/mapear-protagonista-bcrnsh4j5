import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, options?: any) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)
    })

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          console.warn('Session retrieval error:', error.message)
          if (
            error.message.includes('Refresh Token') ||
            error.message.includes('Invalid Refresh Token')
          ) {
            // Clear corrupted session
            supabase.auth.signOut().catch(() => {})
          }
        }
        setSession(data?.session ?? null)
        setUser(data?.session?.user ?? null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Unexpected error during session initialization:', err)
        setSession(null)
        setUser(null)
        setLoading(false)
      })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, options?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options })
      return { data, error }
    } catch (err: any) {
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      // Intercept and return the error object to explicitly prevent unhandled exceptions
      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err: any) {
      // Fallback for network or generic runtime errors
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
