import React from 'react';
import { Redirect } from 'expo-router';
import EstoqueScreen from '../../src/screens/EstoqueScreen';
import { useSession } from '../../src/context/SessionContext';

export default function EstoqueScreenRoute() {
  const { loggedIn } = useSession();

  if (!loggedIn) {
    return <Redirect href="/LoginScreen" />;
  }

  return <EstoqueScreen />;
}
