import { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../supabase';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: null }
        });
        if (signUpError) throw signUpError;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Image 
        source={require('../assets/MealBuddy-logo 2.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: currentTheme.accent }]}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text, borderColor: currentTheme.subtext }]}
          placeholder="Email"
          placeholderTextColor={currentTheme.subtext}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text, borderColor: currentTheme.subtext }]}
          placeholder="Password"
          placeholderTextColor={currentTheme.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={[styles.authButton, { backgroundColor: currentTheme.accent }]} onPress={handleAuth}>
          <Text style={styles.authButtonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={[styles.switchText, { color: currentTheme.accent }]}>
            {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default LoginScreen;
