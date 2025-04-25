// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SavedMealsProvider } from './hooks/useSavedMeals';
import { AuthProvider } from './hooks/useAuth';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
    backgroundColor: '#fff',
  },
});
