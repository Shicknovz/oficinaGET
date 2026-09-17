import React from 'react';
import { Redirect } from 'expo-router';
import { useSession } from '../src/context/SessionContext';

export default function IndexRoute() {
  const { loggedIn, hasSeenIntro } = useSession();

  if (loggedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />;
  }

  if (!hasSeenIntro) {
    return <Redirect href="/IntroScreen" />;
  }

  return <Redirect href="/LoginScreen" />;
}
