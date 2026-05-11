import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import IntroScreen from './src/screens/IntroScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import MainTabs from './src/navigation/MainTabs';
import { readStorage, writeStorage } from './src/utils/storage';

enableScreens();

const APP_UI_STATE_KEY = 'autoget:ui-state';

interface AppUiState {
  loggedIn: boolean;
  showIntro: boolean;
  showRegister: boolean;
  showForgotPassword: boolean;
  showChangePassword: boolean;
}

const DEFAULT_UI_STATE: AppUiState = {
  loggedIn: false,
  showIntro: true,
  showRegister: false,
  showForgotPassword: false,
  showChangePassword: false,
};

export default function App() {
  const [uiState, setUiState] = useState<AppUiState>(DEFAULT_UI_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  const { loggedIn, showIntro, showRegister, showForgotPassword, showChangePassword } = uiState;

  useEffect(() => {
    let mounted = true;

    const hydrateUiState = async () => {
      const storedUiState = await readStorage(APP_UI_STATE_KEY, DEFAULT_UI_STATE);
      if (!mounted) {
        return;
      }

      setUiState(storedUiState);
      setIsHydrated(true);
    };

    void hydrateUiState();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void writeStorage(APP_UI_STATE_KEY, uiState);
  }, [isHydrated, uiState]);

  if (!isHydrated) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
        <NavigationContainer>
          <AppProvider>
            {loggedIn ? (
              showChangePassword ? (
                <ChangePasswordScreen onBack={() => setUiState((current) => ({ ...current, showChangePassword: false }))} />
              ) : (
                <MainTabs
                  onLogout={() => {
                    setUiState((current) => ({
                      ...current,
                      loggedIn: false,
                      showRegister: false,
                      showIntro: false,
                      showForgotPassword: false,
                      showChangePassword: false,
                    }));
                  }}
                  onChangePassword={() => setUiState((current) => ({ ...current, showChangePassword: true }))}
                />
              )
            ) : showRegister ? (
              <RegisterScreen onRegister={() => {
                setUiState((current) => ({ ...current, showRegister: false, showIntro: false }));
              }} onBack={() => setUiState((current) => ({ ...current, showRegister: false }))} />
            ) : showForgotPassword ? (
              <ForgotPasswordScreen onBack={() => setUiState((current) => ({ ...current, showForgotPassword: false }))} />
            ) : showIntro ? (
              <IntroScreen
                onLogin={() => setUiState((current) => ({ ...current, showIntro: false }))}
                onRegister={() => setUiState((current) => ({ ...current, showRegister: true }))}
                onSkip={() => setUiState((current) => ({ ...current, showIntro: false }))}
              />
            ) : (
              <LoginScreen 
                onLogin={() => setUiState((current) => ({ ...current, loggedIn: true }))} 
                onBack={() => setUiState((current) => ({ ...current, showIntro: true }))} 
                onRegister={() => setUiState((current) => ({ ...current, showRegister: true }))}
                onForgotPassword={() => setUiState((current) => ({ ...current, showForgotPassword: true }))}
              />
            )}
          </AppProvider>
        </NavigationContainer>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
