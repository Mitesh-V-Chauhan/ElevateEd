'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { currentUser } from '@/services/interfaces/interface';
import { createUser } from '@/services/firebaseFunctions/post';
import { getUser } from '@/services/firebaseFunctions/get';



interface AuthContextType {
  user: currentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<currentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Map Firebase user to custom User type
  const mapUser = async (firebaseUser: FirebaseUser): Promise<currentUser> => {
    console.log('MapUser - Fetching user data for:', firebaseUser.uid);
    const userData = await getUser(firebaseUser.uid);
    console.log('MapUser - Retrieved user data:', userData);
    const username = userData ? userData.username : firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
    const mappedUser = {
      id: firebaseUser.uid,
      username: username,
      email: firebaseUser.email || '',
      joined: userData?.joined || new Date(),
      onboarding_completed: userData?.onboarding_completed || false,
      location: userData?.location,
      hearAboutUs: userData?.hearAboutUs,
      primaryGoal: userData?.primaryGoal,
      educationLevel: userData?.educationLevel,
      studyTime: userData?.studyTime,
      subjectsOfInterest: userData?.subjectsOfInterest,
      onboarding_completed_at: userData?.onboarding_completed_at,
    }
    console.log('MapUser - Final mapped user:', mappedUser);
    return mappedUser;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user document exists, create if it doesn't
        const existingUserData = await getUser(firebaseUser.uid);
        if (!existingUserData) {
          console.log('User document does not exist during auth state change, creating...');
          const newUserData = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            joined: new Date(),
            onboarding_completed: false,
          };
          await createUser(newUserData);
        }
        
        setUser(await mapUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    if(!user.emailVerified){
      alert("Please verify your email before logging in.");

      // if(confirm("Do you want to resend the verification email?")){
      //   await sendEmailVerification(user);
      //   alert("Verification email resent.");
      // }

      return;
    }

    // Check if user document exists, create if it doesn't
    const existingUserData = await getUser(user.uid);
    if (!existingUserData) {
      console.log('User document does not exist, creating...');
      const mappedUser = {
        id: user.uid,
        username: user.displayName || user.email?.split('@')[0] || '',
        email: user.email || '',
        joined: new Date(),
        onboarding_completed: false,
      };
      await createUser(mappedUser);
    }

    // Now map the user with fresh data
    const mappedUser = await mapUser(user);
    setUser(mappedUser);
  };

  const register = async (email: string, password: string, username?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    if (username) {
      await updateProfile(user, { displayName: username });
    }

    await sendEmailVerification(user);
    alert("Verification email sent. Please check your inbox and verify your email before countinuing");

    // const mappedUser = await mapUser(user); // includes joined: Date
    // await createUser({...mappedUser, joined: new Date()}); // write to Firestore

    // // optionally:
    // setUser(mappedUser); // if using React or similar

    await signOut(auth);
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;
        
        // Check if user document exists, create if it doesn't
        const existingUserData = await getUser(firebaseUser.uid);
        if (!existingUserData) {
          console.log('User document does not exist, creating...');
          const mappedUser = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            joined: new Date(),
            onboarding_completed: false,
          };
          await createUser(mappedUser);
        }
        
        // Now map the user with fresh data
        const mappedUser = await mapUser(firebaseUser);
        setUser(mappedUser);
    } catch (error) {
        console.error("Google login error:", error);
        throw error; // so that UI can show the message if needed
    }
};

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error; // so that UI can show the message if needed
    }
  };

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged will unset user
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      console.log('RefreshUser - Fetching fresh user data...');
      const mappedUser = await mapUser(auth.currentUser);
      console.log('RefreshUser - Fresh user data:', mappedUser);
      setUser(mappedUser);
      console.log('RefreshUser - User state updated');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    googleLogin,
    forgotPassword: sendPasswordReset,
    refreshUser,
    isAuthenticated: !!user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}