import React from 'react';
import { Redirect } from 'expo-router';
import VeiculosScreen from '../../src/screens/VeiculosScreen';
import { useSession } from '../../src/context/SessionContext';

export default function VeiculosScreenRoute() {
  const { loggedIn } = useSession();

  if (!loggedIn) {
    return <Redirect href="/LoginScreen" />;
  }

  return <VeiculosScreen />;
}
