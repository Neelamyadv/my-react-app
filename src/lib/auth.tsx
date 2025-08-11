// Authentication context and hooks for local storage backend
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { localDB } from './database';
import { googleAuth } from './googleAuth';

interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (userData: {
    email: string;
    password: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone: string;
  }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  isGoogleAuthAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Check if Google Auth is available (not in WebContainer environment)
const isGoogleAuthAvailable = () => {
  return !window.location.hostname.includes('webcontainer-api.io') && 
         !window.location.hostname.includes('local-credentialless');
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAuthAvailable] = useState(isGoogleAuthAvailable());

  useEffect(() => {
    // Check for existing local session
    const checkLocalSession = async () => {
      try {
        const { user: localUser } = await localDB.getCurrentUser();
        if (localUser) {
          setUser(localUser);
        }
      } catch (error) {
        console.log('No local session found');
      }
      setLoading(false);
    };
    
    checkLocalSession();
  }, []);

  const signUp = async (userData: {
    email: string;
    password: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone: string;
  }) => {
    try {
      const { user: newUser, error } = await localDB.signUp(userData);
      
      if (error) {
        return { error };
      }

      if (newUser) {
        // Don't automatically sign in after signup - user must login with credentials
        console.log('Account created successfully. Please log in with your credentials.');
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Sign up failed. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: signedInUser, error } = await localDB.signIn(email, password);
      
      if (error) {
        return { error };
      }

      if (signedInUser) {
        setUser(signedInUser);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Sign in failed. Please try again.' };
    }
  };

  const signInWithGoogle = async () => {
    // Return error immediately if Google Auth is not available
    if (!googleAuthAvailable) {
      return { 
        error: 'Google Sign-In is not available in this environment. Please use email/password authentication.' 
      };
    }

    try {
      console.log('Starting Google Sign-In process...');
      const { user: googleUser, error } = await googleAuth.signIn();
      
      if (error || !googleUser) {
        return { error: error || 'Google sign-in failed' };
      }

      console.log('Google user received:', googleUser);

      // Check if user already exists in our database
      const existingUserResult = await localDB.signIn(googleUser.email, 'google-oauth');
      
      if (existingUserResult.user) {
        // User exists, sign them in
        setUser(existingUserResult.user);
        return { error: null };
      }

      // User doesn't exist, create new account
      const googleUserData = {
        email: googleUser.email,
        password: 'google-oauth', // Special password for OAuth users
        first_name: googleUser.given_name || googleUser.name.split(' ')[0] || 'User',
        middle_name: '',
        last_name: googleUser.family_name || googleUser.name.split(' ').slice(1).join(' ') || '',
        phone: '0000000000' // Default phone for OAuth users
      };

      const { user: newUser, error: signUpError } = await localDB.signUp(googleUserData);
      
      if (signUpError) {
        return { error: signUpError };
      }

      if (newUser) {
        setUser(newUser);
      }

      return { error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { error: 'Google sign-in failed. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await localDB.signOut();
      if (!error) {
        setUser(null);
      }
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: 'Sign out failed. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isGoogleAuthAvailable: googleAuthAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};