import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/components/auth-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Test component to access auth context
function TestAuthConsumer() {
  const { user, isAuthenticated, signIn, signOut, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'No User'}</div>
      <button onClick={() => signIn('test@example.com', 'password')} data-testid="sign-in">
        Sign In
      </button>
      <button onClick={() => signOut()} data-testid="sign-out">
        Sign Out
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup supabase mock
    mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({ 
          data: { session: null } 
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } }
        }),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
      },
    };
    
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('should render children and provide loading state', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    // Initially loading
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    
    // After auth check completes
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });
  });

  it('should set authenticated status based on session', async () => {
    // Mock a logged in user
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { 
        session: { 
          user: { id: '123', email: 'test@example.com' } 
        } 
      }
    });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).not.toHaveTextContent('No User');
    });
  });

  it('should call signInWithPassword when signIn is called', async () => {
    const user = userEvent.setup();
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Click sign in button
    await user.click(screen.getByTestId('sign-in'));
    
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should call signOut when signOut is called', async () => {
    const user = userEvent.setup();
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Click sign out button
    await user.click(screen.getByTestId('sign-out'));
    
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle auth state changes', async () => {
    // Initialize authChangeCallback as null
    let authChangeCallback: ((event: string, session: any) => void) | null = null;
    
    // Mock the Supabase auth.onAuthStateChange method
    mockSupabase.auth.onAuthStateChange = jest.fn((callback) => {
      authChangeCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    });

    // Simulate auth state change - only if authChangeCallback is defined
    if (authChangeCallback) {
      act(() => {
        authChangeCallback!('SIGNED_IN', { 
          user: { id: '123', email: 'test@example.com' } 
        });
      });
    }

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });
  });
}); 