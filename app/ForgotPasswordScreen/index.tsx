import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import ForgotPasswordScreen from '../../src/screens/ForgotPasswordScreen';
import { useSession } from '../../src/context/SessionContext';

export default function ForgotPasswordScreenRoute() {
  const router = useRouter();
  const { loggedIn } = useSession();

  if (loggedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />;
  }

  return <ForgotPasswordScreen onBack={() => router.back()} />;
}
