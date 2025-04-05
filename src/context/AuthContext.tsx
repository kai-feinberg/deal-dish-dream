
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
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoaded(true);

      // Redirect logic after authentication
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('has_completed_onboarding')
          .eq('id', session.user.id)
          .single();

        const hasCompleted = Boolean(profileData?.has_completed_onboarding);
        setHasCompletedOnboarding(hasCompleted);
          
        if (hasCompleted) {
          navigate('/upload');
        } else {
          navigate('/onboarding');
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Redirect logic for signup/login
        if (session?.user) {
          supabase
            .from('profiles')
            .select('has_completed_onboarding')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profileData }) => {
              const hasCompleted = Boolean(profileData?.has_completed_onboarding);
              setHasCompletedOnboarding(hasCompleted);
                
              if (hasCompleted) {
                navigate('/upload');
              } else {
                navigate('/onboarding');
              }
            });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
