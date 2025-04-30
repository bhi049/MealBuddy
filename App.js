import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SavedMealsProvider } from './hooks/useSavedMeals';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import MainNavigator from './navigation/MainNavigator';
import { themes } from './constants/theme';

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <AuthProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={currentTheme.background}
        />
        <SavedMealsProvider>
          <MainNavigator />
        </SavedMealsProvider>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
