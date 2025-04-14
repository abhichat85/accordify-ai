import React, { ReactNode, useEffect, useState } from 'react';
import { TeamProvider } from '@/contexts/TeamContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { supabase } from '@/integrations/supabase/client';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUserId(data?.user?.id);
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserId(session?.user?.id);
      }
    );

    getCurrentUser();

    // Clean up the subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <TeamProvider userId={userId}>
      <WorkspaceProvider userId={userId}>
        {children}
      </WorkspaceProvider>
    </TeamProvider>
  );
};
