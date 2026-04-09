import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import IntroScreen from './src/screens/IntroScreen';
import MainTabs from './src/navigation/MainTabs';

enableScreens();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
        <NavigationContainer>
          <AppProvider>
            {loggedIn ? (
              <MainTabs />
            ) : showIntro ? (
              <IntroScreen onLogin={() => setShowIntro(false)} onSkip={() => setShowIntro(false)} />
            ) : (
              <LoginScreen onLogin={() => setLoggedIn(true)} onBack={() => setShowIntro(true)} />
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
