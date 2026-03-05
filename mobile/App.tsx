import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiBaseUrl, API_BASE_URL_STORAGE_KEY } from './src/services/api';
import { ServerConfigProvider } from './src/context/ServerConfigContext';
import RootNavigator from './src/navigation/RootNavigator';
import ConfigScreen from './src/screens/ConfigScreen';
import { colors } from './src/theme/colors';

export default function App() {
  const [hasServerUrl, setHasServerUrl] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const url = await AsyncStorage.getItem(API_BASE_URL_STORAGE_KEY);
        if (url) {
          setApiBaseUrl(url);
          setHasServerUrl(true);
        } else {
          setHasServerUrl(false);
        }
      } catch {
        setHasServerUrl(false);
      }
    })();
  }, []);

  if (hasServerUrl === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!hasServerUrl) {
    return (
      <>
        <StatusBar style="light" />
        <ConfigScreen onDone={() => setHasServerUrl(true)} />
      </>
    );
  }

  return (
    <ServerConfigProvider showConfigAgain={() => setHasServerUrl(false)}>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </ServerConfigProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

