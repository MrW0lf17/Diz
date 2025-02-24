import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: import.meta.env.DEV
  },
});

// Initialize auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, hasSession: !!session });
  
  if (event === 'SIGNED_OUT') {
    console.log('Handling sign out cleanup...');
    
    // Clear all auth data
    window.localStorage.removeItem('supabase.auth.token');
    window.sessionStorage.removeItem('supabase.auth.token');
    
    // Clear any other app-specific data
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('sb-' + supabaseUrl + '-auth-token');
    
    // Force reload to clear all state
    window.location.href = '/';
  } else if (event === 'SIGNED_IN') {
    console.log('Sign in completed, redirecting...');
    // If we're on the callback page, redirect to dashboard
    if (window.location.pathname === '/auth/callback') {
      window.location.replace('/dashboard');
    }
  }
});

// Test the connection and auth setup
const testConnection = async () => {
  try {
    // Test database connection
    const { data: dbTest, error: dbError } = await supabase
      .from('generated_images')
      .select('count')
      .single();
    
    if (dbError) {
      console.error('Database connection test failed:', dbError);
      if (import.meta.env.DEV) {
        toast.error('Database connection failed. Check console for details.');
      }
    } else {
      console.log('Database connection test successful:', dbTest);
    }

    // Test auth session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session test failed:', sessionError);
      if (import.meta.env.DEV) {
        toast.error('Session test failed. Check console for details.');
      }
    } else {
      console.log('Session test:', session ? 'Active session found' : 'No active session');
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    if (import.meta.env.DEV) {
      toast.error('Connection test failed. Check console for details.');
    }
  }
};

// Run connection test in development only
if (import.meta.env.DEV) {
  testConnection();
}

// Helper to check if a session exists
export const hasActiveSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

// Helper to refresh session
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
};

// Export helper functions with better error handling
export const signUp = async (email: string, password: string) => {
  console.log('Attempting signup for:', email);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    console.log('Signup successful:', data);
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  console.log('Attempting signin for:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    console.log('Sign in successful:', data);
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  console.log('Supabase: Starting sign out process');
  try {
    // Sign out from Supabase with global scope
    const { error } = await supabase.auth.signOut({
      scope: 'global'
    });
    if (error) throw error;

    // Clear any stored tokens immediately
    window.localStorage.removeItem('supabase.auth.token');
    window.sessionStorage.removeItem('supabase.auth.token');
    
    console.log('Sign out successful');
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Storage helper functions with improved error handling
export const uploadToStorage = async (bucket: string, path: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getPublicUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data;
  } catch (error) {
    console.error('Error getting public URL:', error);
    throw error;
  }
};

// Google OAuth sign in
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}; 