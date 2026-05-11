import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import ChangePasswordScreen from '../../src/screens/ChangePasswordScreen';
import { useSession } from '../../src/context/SessionContext';

export default function ChangePasswordScreenRoute() {
  const router = useRouter();
  const { loggedIn } = useSession();

  if (!loggedIn) {
    return <Redirect href="/LoginScreen" />;
  }

  return <ChangePasswordScreen onBack={() => router.replace('/(tabs)/HomeScreen')} />;
}
