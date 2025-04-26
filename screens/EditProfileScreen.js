import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../supabase';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const EditProfileScreen = ({ navigation }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, username, bio, avatar_url')
          .eq('id', user.id)
          .single();
        if (data) {
          setFullName(data.full_name || '');
          setUsername(data.username || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || null);
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
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
        <Feather name="moon" size={24} color={currentTheme.accent} />
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} disabled={uploading}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: currentTheme.inputBackground }]}>
            <Feather name="camera" size={28} color={currentTheme.accent} />
            <Text style={[styles.avatarPlaceholderText, { color: currentTheme.accent }]}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: currentTheme.text, borderBottomColor: currentTheme.subtext }]}
        placeholder="Full Name"
        placeholderTextColor={currentTheme.subtext}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={[styles.input, { color: currentTheme.text, borderBottomColor: currentTheme.subtext }]}
        placeholder="Username"
        placeholderTextColor={currentTheme.subtext}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.bioInput, { color: currentTheme.text, borderBottomColor: currentTheme.subtext }]}
        placeholder="Bio"
        placeholderTextColor={currentTheme.subtext}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  toggleButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
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
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
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
});

export default EditProfileScreen;
