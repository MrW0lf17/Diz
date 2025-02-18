import { createClient } from '@supabase/supabase-js'

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
    detectSessionInUrl: true
  },
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
    } else {
      console.log('Database connection test successful:', dbTest);
    }

    // Test auth session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session test failed:', sessionError);
    } else {
      console.log('Session test:', session ? 'Active session found' : 'No active session');
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }
};

// Run connection test
testConnection();

// Export helper functions with better error handling
export const signUp = async (email: string, password: string) => {
  console.log('Attempting signup for:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Signup error:', error);
    throw error;
  }
  console.log('Signup successful:', data);
  return data;
};

export const signIn = async (email: string, password: string) => {
  console.log('Attempting signin for:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }
  console.log('Sign in successful:', data);
  return data;
};

export const signOut = async () => {
  console.log('Attempting sign out');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
  console.log('Sign out successful');
};

// Storage helper functions with improved error handling
export const uploadToStorage = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  if (error) {
    console.error('Upload error:', error)
    throw error
  }
  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data
} 