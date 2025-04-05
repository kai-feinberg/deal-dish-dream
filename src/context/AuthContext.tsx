
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  hasCompletedOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  isLoaded: false,
  signIn: async () => {},
  signUp: async () => {},
  hasCompletedOnboarding: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Use setTimeout to avoid potential deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            supabase
              .from('profiles')
              .select('has_completed_onboarding')
              .eq('id', currentSession.user.id)
              .single()
              .then(({ data: profileData }) => {
                const hasCompleted = Boolean(profileData?.has_completed_onboarding);
                setHasCompletedOnboarding(hasCompleted);
                
                if (event === 'SIGNED_IN') {
                  if (hasCompleted) {
                    navigate('/upload');
                  } else {
                    navigate('/onboarding');
                  }
                }
              });
          }, 0);
        }
      }
    );

    // THEN check for existing session
    const initialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('has_completed_onboarding')
          .eq('id', session.user.id)
          .single();

        const hasCompleted = Boolean(profileData?.has_completed_onboarding);
        setHasCompletedOnboarding(hasCompleted);
      }
      
      setIsLoaded(true);
    };
    
    initialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Navigation is handled in the auth state change listener
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An error occurred while signing in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // For easier testing, use signInWithPassword instead of signUp for now
      // This bypasses the email verification step
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      
      // Navigation is handled in the auth state change listener or redirect
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An error occurred while creating your account.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut, isLoaded, signIn, signUp, hasCompletedOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
