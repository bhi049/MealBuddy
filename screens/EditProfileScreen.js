import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const EditProfileScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [email, setEmail] = useState('');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, username, bio, avatar_url, birthdate, favorite_food, email')
          .eq('id', user.id)
          .single();
        if (data) {
          setFullName(data.full_name || '');
          setUsername(data.username || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || null);
          setBirthdate(data.birthdate || '');
          setFavoriteFood(data.favorite_food || '');
          setEmail(data.email || '');
        }
      }
      if (userError) console.error('Auth error:', userError);
    };

    fetchUserAndProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageAsset = result.assets[0];
      setUploading(true);

      const filePath = `${userId}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(imageAsset.base64), {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert('Upload failed', uploadError.message);
      } else {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setAvatarUrl(data.publicUrl);
      }

      setUploading(false);
    }
  };

  const updateProfile = async () => {
    if (!userId) return;

    setSaving(true);
    const updates = {
      id: userId,
      full_name: fullName,
      username,
      bio,
      avatar_url: avatarUrl,
      birthdate,
      favorite_food: favoriteFood,
      email,
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } else {
      navigation.goBack();
    }
    setSaving(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Feather name="camera" size={28} color={currentTheme.accent} />
            <Text style={[styles.avatarPlaceholderText, { color: currentTheme.accent }]}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Toggle Dark Mode */}
      <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { borderColor: currentTheme.border }]}>
        <Feather name="moon" size={18} color={currentTheme.text} />
        <Text style={[styles.themeToggleText, { color: currentTheme.text }]}>Toggle Dark Mode</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, inputStyle(currentTheme)]}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, inputStyle(currentTheme)]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, inputStyle(currentTheme)]}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, inputStyle(currentTheme)]}
        placeholder="Birthdate (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, inputStyle(currentTheme)]}
        placeholder="Favorite Food"
        value={favoriteFood}
        onChangeText={setFavoriteFood}
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, inputStyle(currentTheme)]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={currentTheme.subtext}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: currentTheme.accent }]}
        onPress={updateProfile}
        disabled={saving || uploading}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const inputStyle = (theme) => ({
  backgroundColor: theme.surface,
  color: theme.text,
  borderColor: theme.border,
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffeaea',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarPlaceholderText: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
