import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, requires authentication to access
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const router = useRouter();
  const { 
    isAuthenticated, 
    pinEnabled, 
    isLoading, 
    checkOnboarding,
    checkAuth,
    tryAutoAuthenticate 
  } = useAuthStore();
  
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeAndCheck = async () => {
      try {
        // Check onboarding status first
        const hasCompleted = await checkOnboarding();
        
        if (!hasCompleted) {
          router.replace('/(auth)/onboarding');
          return;
        }

        // Check auth capabilities
        await checkAuth();
        
        // Try auto-authentication
        const autoAuthSuccess = await tryAutoAuthenticate();
        
        if (requireAuth && !autoAuthSuccess && !isAuthenticated) {
          // If this route requires auth and user is not authenticated
          if (!pinEnabled) {
            router.replace('/(auth)/setup');
          } else {
            router.replace('/(auth)/login');
          }
          return;
        } else if (!requireAuth && autoAuthSuccess) {
          // If user is authenticated and on auth screens, redirect to main app
          router.replace('/(tabs)');
          return;
        }
        
      } catch (error) {
        console.error('Auth guard initialization error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (!isLoading) {
      initializeAndCheck();
    }
  }, [isLoading, requireAuth, isAuthenticated, pinEnabled, checkOnboarding, checkAuth, tryAutoAuthenticate, router]);

  // Show loading while checking authentication
  if (isChecking || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <>{children}</>;
}

// Hook for components that need to check auth status
export function useRequireAuth() {
  const { isAuthenticated, pinEnabled, checkAuth, tryAutoAuthenticate } = useAuthStore();
  const router = useRouter();

  const checkAuthStatus = async () => {
    await checkAuth();
    const autoAuthSuccess = await tryAutoAuthenticate();
    
    if (!autoAuthSuccess && !isAuthenticated) {
      if (!pinEnabled) {
        router.replace('/(auth)/setup');
      } else {
        router.replace('/(auth)/login');
      }
      return false;
    }
    
    return true;
  };

  return { isAuthenticated, checkAuthStatus };
}