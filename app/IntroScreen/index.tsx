import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import IntroScreen from '../../src/screens/IntroScreen';
import { useSession } from '../../src/context/SessionContext';

export default function IntroScreenRoute() {
  const router = useRouter();
  const { loggedIn, markIntroSeen } = useSession();

  if (loggedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />;
  }

  return (
    <IntroScreen
      onLogin={() => {
        markIntroSeen();
        router.push('/LoginScreen');
      }}
      onRegister={() => {
        markIntroSeen();
        router.push('/CadastroScreen');
      }}
      onSkip={() => {
        markIntroSeen();
        router.replace('/LoginScreen');
      }}
    />
  );
}
