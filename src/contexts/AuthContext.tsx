import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import WelcomeModal from '../components/WelcomeModal'
import MobileWelcomeModal from '../components/MobileWelcomeModal'

interface AuthContextType {
  user: User | null
  role: string | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithTestCredentials: () => Promise<void>
  isTestLoginLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTestLoginLoading, setIsTestLoginLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const navigate = useNavigate()

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.role || 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false)

      // Show welcome modal for new sign-ups
      if (event === 'SIGNED_IN' && session?.user?.created_at) {
        const createdAt = new Date(session.user.created_at)
        const now = new Date()
        const isNewUser = (now.getTime() - createdAt.getTime()) < 1000 * 60 // Within 1 minute
        
        if (isNewUser) {
          setShowWelcomeModal(true)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Add screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const signOut = useCallback(async () => {
    console.log('AuthContext: Starting sign out process')
    try {
      // First clear all state
      setUser(null)
      setRole(null)
      setShowWelcomeModal(false)

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Show success message
      toast.success('Signed out successfully')

      // Use a small delay to ensure state is cleared before navigation
      setTimeout(() => {
        window.location.replace('/')
      }, 100)
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
      // Reset state on error
      setUser(null)
      setRole(null)
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  const signInWithTestCredentials = async () => {
    console.log('Starting test login...')
    setIsTestLoginLoading(true)
    try {
      // First check if we already have a session
      const { data: { session: existingSession } } = await supabase.auth.getSession()
      if (existingSession) {
        console.log('Found existing session, signing out first...')
        await signOut()
        // Wait a bit for the signout to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      console.log('Attempting test login...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@ditoolz.pro',
        password: 'test123456'
      })
      
      if (error) {
        console.error('Test login error:', error)
        throw error
      }
      
      console.log('Test login successful:', data)
      if (data?.user) {
        // Update user metadata to include pro access
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            is_premium: true,
            subscription_tier: 'pro',
            subscription_status: 'active'
          }
        })
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError)
          throw updateError
        }

        // Refresh the user data to include the updated metadata
        const { data: { user: updatedUser }, error: refreshError } = await supabase.auth.getUser()
        if (refreshError) {
          console.error('Error refreshing user data:', refreshError)
          throw refreshError
        }

        setUser(updatedUser)
        toast.success('Logged in successfully as test user (Pro)')

        // Verify the session is active
        const { data: { session: verifySession } } = await supabase.auth.getSession()
        if (!verifySession) {
          throw new Error('Session not established after login')
        }
        console.log('Session verified after login')
      }
    } catch (error) {
      console.error('Test login error:', error)
      toast.error('Failed to login with test account')
      // Clean up any partial state
      setUser(null)
    } finally {
      setIsTestLoginLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      signOut,
      signInWithGoogle,
      signInWithTestCredentials,
      isTestLoginLoading
    }}>
      {children}
      {isMobile ? (
        <MobileWelcomeModal 
          isOpen={showWelcomeModal} 
          onClose={() => setShowWelcomeModal(false)} 
        />
      ) : (
        <WelcomeModal 
          isOpen={showWelcomeModal} 
          onClose={() => setShowWelcomeModal(false)} 
        />
      )}
    </AuthContext.Provider>
  )
}

export default AuthContext 