import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import RegisterScreen from '../../src/screens/RegisterScreen';
import { useSession } from '../../src/context/SessionContext';

export default function CadastroScreenRoute() {
  const router = useRouter();
  const { loggedIn, markIntroSeen } = useSession();

  if (loggedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />;
  }

  return (
    <RegisterScreen
      onRegister={() => {
        markIntroSeen();
        router.replace('/LoginScreen');
      }}
      onBack={() => router.back()}
    />
  );
}
