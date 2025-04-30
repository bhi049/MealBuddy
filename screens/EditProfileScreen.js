import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { decode } from 'base64-arraybuffer';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [email, setEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const removeAvatar = async () => {
    setAvatarUrl(null);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateProfile = async () => {
    if (!userId) return;
    if (email && !validateEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

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

      {avatarUrl && (
        <TouchableOpacity onPress={removeAvatar} style={styles.removePhotoButton}>
          <Feather name="x" size={16} color={currentTheme.accent} />
          <Text style={[styles.removePhotoText, { color: currentTheme.accent }]}>Remove Photo</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.surface, color: currentTheme.text, borderColor: currentTheme.border }]}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.surface, color: currentTheme.text, borderColor: currentTheme.border }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.surface, color: currentTheme.text, borderColor: currentTheme.border, height: 80, textAlignVertical: 'top' }]}
        placeholder="Bio"
        value={bio}
        onChangeText={(text) => text.length <= 200 && setBio(text)}
        multiline
        numberOfLines={3}
        placeholderTextColor={currentTheme.subtext}
      />
      <Text style={[styles.charCount, { color: currentTheme.subtext }]}>{bio.length}/200 characters</Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { backgroundColor: currentTheme.surface, borderColor: currentTheme.border }]}>
        <Text style={{ color: birthdate ? currentTheme.text : currentTheme.subtext }}>
          {birthdate || 'Select Birthdate'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthdate ? new Date(birthdate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const iso = selectedDate.toISOString().split('T')[0];
              setBirthdate(iso);
            }
          }}
        />
      )}

      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.surface, color: currentTheme.text, borderColor: currentTheme.border }]}
        placeholder="Favorite Food"
        value={favoriteFood}
        onChangeText={setFavoriteFood}
        placeholderTextColor={currentTheme.subtext}
      />
      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.surface, color: currentTheme.text, borderColor: currentTheme.border }]}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffeaea',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  avatarPlaceholderText: {
    fontSize: 12,
    marginTop: 4,
  },
  removePhotoButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  removePhotoText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  charCount: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    fontSize: 12,
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
