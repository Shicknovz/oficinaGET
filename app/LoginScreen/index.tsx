import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import LoginScreen from '../../src/screens/LoginScreen';
import { useSession } from '../../src/context/SessionContext';

export default function LoginScreenRoute() {
  const router = useRouter();
  const { loggedIn, login, markIntroSeen } = useSession();

  if (loggedIn) {
    return <Redirect href="/(tabs)/HomeScreen" />;
  }

  return (
    <LoginScreen
      onLogin={() => {
        markIntroSeen();
        login();
        router.replace('/(tabs)/HomeScreen');
      }}
      onBack={() => router.push('/IntroScreen')}
      onRegister={() => {
        markIntroSeen();
        router.push('/CadastroScreen');
      }}
      onForgotPassword={() => router.push('/ForgotPasswordScreen')}
    />
  );
}
