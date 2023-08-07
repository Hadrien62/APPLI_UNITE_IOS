import React, { useEffect } from 'react';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import Navigation from './navigation-pages';
import SplashScreen from 'expo-splash-screen';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigation />
    </SafeAreaView>
  );
};

export default App;
