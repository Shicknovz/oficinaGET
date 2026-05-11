import React from 'react';
import { Redirect } from 'expo-router';
import AgendamentoScreen from '../../src/screens/AgendamentoScreen';
import { useSession } from '../../src/context/SessionContext';

export default function AgendamentoScreenRoute() {
  const { loggedIn } = useSession();

  if (!loggedIn) {
    return <Redirect href="/LoginScreen" />;
  }

  return <AgendamentoScreen />;
}
