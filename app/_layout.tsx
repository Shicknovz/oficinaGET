import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { AppProvider } from '../src/context/AppContext';
import { AppMenuProvider } from '../src/context/AppMenuContext';
import { SessionProvider, useSession } from '../src/context/SessionContext';
import { ThemeProvider } from '../src/context/ThemeContext';

enableScreens();

function RootNavigator() {
  const router = useRouter();
  const session = useSession();

  return (
    <AppMenuProvider
      onLogout={() => {
        session.logout();
        router.replace('/LoginScreen');
      }}
      onChangePassword={() => router.push('/ChangePasswordScreen')}
    >
      <StatusBar style="light" backgroundColor="#0D1117" translucent={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="IntroScreen/index" />
        <Stack.Screen name="LoginScreen/index" />
        <Stack.Screen name="CadastroScreen/index" />
        <Stack.Screen name="ForgotPasswordScreen/index" />
        <Stack.Screen name="ChangePasswordScreen/index" />
        <Stack.Screen name="VeiculosScreen/index" />
        <Stack.Screen name="AgendamentoScreen/index" />
        <Stack.Screen name="EstoqueScreen/index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppMenuProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SessionProvider>
          <AppProvider>
            <RootNavigator />
          </AppProvider>
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
