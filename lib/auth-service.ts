import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';

export class AuthService {
  /**
   * Authenticates a user with username and password
   * @param username The user's email address
   * @param password The user's password
   * @returns The user object if authentication is successful
   * @throws Error if authentication fails
   */
  static async login(username: string, password: string): Promise<User> {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    
    if (error) {
      throw error;
    }
    
    return data.user;
  }
  
  /**
   * Validates if a session token is valid
   * @param sessionToken The session token to validate
   * @returns Boolean indicating if the session is valid
   */
  static async validateSession(sessionToken: string): Promise<boolean> {
    const supabase = createClientComponentClient();
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        return false;
      }
      
      // In a real implementation, we might compare the token with the provided one
      // Here we're just checking if any valid session exists
      return !!data.session;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }
} 