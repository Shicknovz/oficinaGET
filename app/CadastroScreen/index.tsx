import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import RegisterScreen from '../../src/screens/RegisterScreen';
import { useSession } from '../../src/context/SessionContext';

export default function CadastroScreenRoute() {
  const router = useRouter();
  const { loggedIn, register, markIntroSeen } = useSession();

  if (loggedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />;
  }

  return (
    <RegisterScreen
      onRegister={async (nome, email, senha) => {
        await register(nome, email, senha);
        markIntroSeen();
        router.replace('/(tabs)/HomeScreen');
      }}
      onBack={() => router.back()}
    />
  );
}
