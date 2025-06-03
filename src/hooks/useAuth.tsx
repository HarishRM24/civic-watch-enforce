
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  userRole: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user profile if logged in
        if (currentSession?.user) {
          // Use setTimeout to avoid potential RLS issues
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 100);
        } else {
          setUserProfile(null);
          setUserRole(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log('Existing session:', existingSession?.user?.email);
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        if (existingSession?.user) {
          await fetchUserProfile(existingSession.user.id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If profile doesn't exist, create one with current user data
        if (error.code === 'PGRST116') {
          await createUserProfile(userId);
        }
        return;
      }

      if (data) {
        console.log('User profile loaded:', data);
        setUserProfile(data);
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) return;

      const email = currentUser.data.user.email || '';
      const displayName = currentUser.data.user.user_metadata?.display_name || 
                         currentUser.data.user.user_metadata?.full_name ||
                         email.split('@')[0];

      console.log('Creating profile for user:', userId, 'with email:', email, 'and display name:', displayName);

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'civilian',
          display_name: displayName
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      if (data) {
        console.log('User profile created:', data);
        setUserProfile(data);
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Unexpected error creating user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link before logging in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return false;
      }

      if (data.user) {
        console.log('Login successful for:', email);
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, role: string, displayName?: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email, 'with role:', role, 'display name:', displayName);
      
      // Get current origin for redirect URL
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role,
            display_name: displayName || email.split('@')[0],
            full_name: displayName || email.split('@')[0],
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('Registration successful for:', email);
        
        if (data.user.email_confirmed_at) {
          toast({
            title: "Registration successful",
            description: "Your account has been created and you are now logged in.",
          });
        } else {
          toast({
            title: "Registration successful",
            description: "Please check your email and click the confirmation link to activate your account.",
          });
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
      setUserRole(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      userProfile,
      userRole,
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
