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
  const initialUiState = readStorage(APP_UI_STATE_KEY, DEFAULT_UI_STATE);
  const [loggedIn, setLoggedIn] = useState(initialUiState.loggedIn);
  const [showIntro, setShowIntro] = useState(initialUiState.showIntro);
  const [showRegister, setShowRegister] = useState(initialUiState.showRegister);
  const [showForgotPassword, setShowForgotPassword] = useState(initialUiState.showForgotPassword);
  const [showChangePassword, setShowChangePassword] = useState(initialUiState.showChangePassword);

  useEffect(() => {
    writeStorage(APP_UI_STATE_KEY, {
      loggedIn,
      showIntro,
      showRegister,
      showForgotPassword,
      showChangePassword,
    });
  }, [loggedIn, showIntro, showRegister, showForgotPassword, showChangePassword]);

  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
        <NavigationContainer>
          <AppProvider>
            {loggedIn ? (
              showChangePassword ? (
                <ChangePasswordScreen onBack={() => setShowChangePassword(false)} />
              ) : (
                <MainTabs
                  onLogout={() => {
                    setLoggedIn(false);
                    setShowRegister(false);
                    setShowIntro(false);
                    setShowForgotPassword(false);
                    setShowChangePassword(false);
                  }}
                  onChangePassword={() => setShowChangePassword(true)}
                />
              )
            ) : showRegister ? (
              <RegisterScreen onRegister={() => { setShowRegister(false); setShowIntro(false); }} onBack={() => setShowRegister(false)} />
            ) : showForgotPassword ? (
              <ForgotPasswordScreen onBack={() => setShowForgotPassword(false)} />
            ) : showIntro ? (
              <IntroScreen onLogin={() => setShowIntro(false)} onRegister={() => setShowRegister(true)} onSkip={() => setShowIntro(false)} />
            ) : (
              <LoginScreen 
                onLogin={() => setLoggedIn(true)} 
                onBack={() => setShowIntro(true)} 
                onRegister={() => setShowRegister(true)}
                onForgotPassword={() => setShowForgotPassword(true)}
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
