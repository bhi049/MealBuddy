import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SavedMealsContext } from '../hooks/useSavedMeals';
import { AuthContext } from '../hooks/useAuth';
import { supabase } from '../supabase';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const { savedMeals, removeMeal } = useContext(SavedMealsContext);
  const { user, logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: '',
    avatar_url: null,
    birthdate: '',
    favorite_food: '',
    email: '',
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, username, bio, avatar_url, birthdate, favorite_food, email')
      .eq('id', user.id)
      .single();
    if (data) setProfile(data);
    if (error) console.error('Error loading profile:', error);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [user])
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.profileCardRow, { backgroundColor: currentTheme.surface }]}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarLarge} />
          ) : (
            <View style={styles.avatarLargePlaceholder}>
              <Feather name="user" size={40} color={currentTheme.accent} />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.profileInfoContainer}>
          <Text style={[styles.fullName, { color: currentTheme.text }]}>{profile.full_name || 'My Kitchen'}</Text>
          {profile.username ? (
            <Text style={[styles.usernameText, { color: currentTheme.subtext }]}>@{profile.username}</Text>
          ) : null}
          {profile.bio ? (
            <Text style={[styles.bioText, { color: currentTheme.subtext }]}>{profile.bio}</Text>
          ) : null}
          {profile.birthdate ? (
            <Text style={[styles.extraInfo, { color: currentTheme.subtext }]}>🎂 {profile.birthdate}</Text>
          ) : null}
          {profile.favorite_food ? (
            <Text style={[styles.extraInfo, { color: currentTheme.subtext }]}>🍽️ Favorite: {profile.favorite_food}</Text>
          ) : null}
          <TouchableOpacity style={[styles.editButtonSmall, { backgroundColor: currentTheme.accent }]} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonTextSmall}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.savedRecipesSection, { backgroundColor: currentTheme.surface }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Saved Recipes</Text>
        {savedMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="bookmark" size={48} color={currentTheme.subtext} />
            <Text style={[styles.emptyText, { color: currentTheme.subtext }]}>No saved recipes yet</Text>
          </View>
        ) : (
          <FlatList
            data={savedMeals}
            keyExtractor={(item) => `profile_${item.idMeal}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.recipeCard, { backgroundColor: currentTheme.surface }]}
                onPress={() => navigation.navigate('MealDetail', { meal: item })}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <Text style={[styles.recipeName, { color: currentTheme.text }]}>{item.strMeal}</Text>
                  <Text style={[styles.recipeCategory, { color: currentTheme.subtext }]}>
                    {item.strCategory} • {item.strArea}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMeal(item.idMeal)}
                >
                  <Feather name="trash-2" size={20} color={currentTheme.accent} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.recipeList}
          />
        )}
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: currentTheme.surface }]} onPress={logout}>
        <Feather name="log-out" size={20} color={currentTheme.accent} />
        <Text style={[styles.logoutText, { color: currentTheme.accent }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  profileCardRow: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
  },
  avatarLargePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  fullName: {
    fontSize: 20,
    fontWeight: '700',
  },
  usernameText: {
    fontSize: 14,
    marginTop: 4,
  },
  bioText: {
    fontSize: 14,
    marginTop: 8,
  },
  extraInfo: {
    fontSize: 13,
    marginTop: 4,
  },
  editButtonSmall: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonTextSmall: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  savedRecipesSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recipeList: { paddingBottom: 16 },
  recipeCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  recipeImage: { width: 80, height: 80, backgroundColor: '#f1f1f1' },
  recipeInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  recipeName: { fontSize: 16, fontWeight: '600' },
  recipeCategory: { fontSize: 13 },
  removeButton: { padding: 12, justifyContent: 'center' },

  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, marginTop: 16 },

  logoutButton: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
