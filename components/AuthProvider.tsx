'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Authentication Provider for Supabase integration
 * Handles user login, signup, and session management
 */

interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('chat_token');
      const userData = localStorage.getItem('chat_user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Use our backend authentication
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('chat_token', data.token);
        localStorage.setItem('chat_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, displayName })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('chat_token', data.token);
        localStorage.setItem('chat_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');
      setUser(null);
      
      // Disconnect from voice chat if connected
      if (typeof window !== 'undefined' && (window as any).voiceChat) {
        (window as any).voiceChat.disconnect();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getToken = async (): Promise<string | null> => {
    return localStorage.getItem('chat_token');
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Simple login component
export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, username, displayName);
      } else {
        result = await signIn(email, password);
      }

      if (!result.success) {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts for testing
  const handleDemoLogin = async (demoUser: 'user1' | 'user2' | 'user3') => {
    const demoAccounts = {
      user1: { email: 'demo1@example.com', password: 'demo123', username: 'CoolGamer123' },
      user2: { email: 'demo2@example.com', password: 'demo123', username: 'DevPro456' },
      user3: { email: 'demo3@example.com', password: 'demo123', username: 'CreativeArt789' }
    };

    const account = demoAccounts[demoUser];
    setEmail(account.email);
    setPassword(account.password);
    
    const result = await signIn(account.email, account.password);
    if (!result.success) {
      setError(result.error || 'Demo login failed');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#36393f',
        padding: '40px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90vw'
      }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {/* Demo Login Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#b9bbbe', fontSize: '14px', marginBottom: '10px' }}>
            Quick Demo Login:
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleDemoLogin('user1')}
              style={{
                background: '#5865f2',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Demo User 1
            </button>
            <button
              onClick={() => handleDemoLogin('user2')}
              style={{
                background: '#5865f2',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Demo User 2
            </button>
            <button
              onClick={() => handleDemoLogin('user3')}
              style={{
                background: '#5865f2',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Demo User 3
            </button>
          </div>
        </div>

        <div style={{ height: '1px', background: '#4f545c', margin: '20px 0' }} />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#b9bbbe', display: 'block', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                background: '#40444b',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          {isSignUp && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#b9bbbe', display: 'block', marginBottom: '8px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  maxLength={30}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#40444b',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#b9bbbe', display: 'block', marginBottom: '8px' }}>
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#40444b',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#b9bbbe', display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px',
                background: '#40444b',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#f04747',
              background: 'rgba(240, 71, 71, 0.1)',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#4f545c' : '#5865f2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              color: '#5865f2',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
