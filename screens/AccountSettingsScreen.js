import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const AccountSettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  const handleDeleteAccount = () => {
    Alert.alert('Not implemented', 'Account deletion feature is not implemented yet.');
  };

  const handleChangePassword = () => {
    Alert.alert('Not implemented', 'Password change feature is not implemented yet.');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Appearance</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: currentTheme.text }]}>Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: currentTheme.accent }}
          thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Account</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.surface }]} onPress={handleChangePassword}>
        <Feather name="lock" size={20} color={currentTheme.accent} />
        <Text style={[styles.buttonText, { color: currentTheme.text }]}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.surface }]} onPress={handleDeleteAccount}>
        <Feather name="trash" size={20} color={currentTheme.accent} />
        <Text style={[styles.buttonText, { color: currentTheme.text }]}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default AccountSettingsScreen;
