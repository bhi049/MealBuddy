import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SavedMealsContext } from '../hooks/useSavedMeals';
import { AuthContext } from '../hooks/useAuth';
import { supabase } from '../supabase';

const ProfileScreen = ({ navigation }) => {
  const { savedMeals, removeMeal } = useContext(SavedMealsContext);
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: '',
    avatar_url: null,
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, username, bio, avatar_url')
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
    <ScrollView style={styles.container}>
      <View style={styles.profileCardRow}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarLarge} />
          ) : (
            <View style={styles.avatarLargePlaceholder}>
              <Feather name="user" size={40} color="#ff6b6b" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.fullName}>{profile.full_name || 'My Kitchen'}</Text>
          {profile.username ? (
            <Text style={styles.usernameText}>@{profile.username}</Text>
          ) : null}
          {profile.bio ? (
            <Text style={styles.bioText}>{profile.bio}</Text>
          ) : null}
          <TouchableOpacity style={styles.editButtonSmall} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonTextSmall}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.savedRecipesSection}>
        <Text style={styles.sectionTitle}>Saved Recipes</Text>
        {savedMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="bookmark" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No saved recipes yet</Text>
          </View>
        ) : (
          <FlatList
            data={savedMeals}
            keyExtractor={(item) => `profile_${item.idMeal}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recipeCard}
                onPress={() => navigation.navigate('MealDetail', { meal: item })}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{item.strMeal}</Text>
                  <Text style={styles.recipeCategory}>{item.strCategory} • {item.strArea}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMeal(item.idMeal)}
                >
                  <Feather name="trash-2" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.recipeList}
          />
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Feather name="log-out" size={20} color="#ff6b6b" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  profileCardRow: {
    backgroundColor: '#fff',
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
    color: '#2d3436',
  },
  usernameText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  editButtonSmall: {
    marginTop: 12,
    backgroundColor: '#ff6b6b',
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
    backgroundColor: '#fff',
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
    color: '#2d3436',
    marginBottom: 12,
  },
  recipeList: { paddingBottom: 16 },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  recipeImage: { width: 80, height: 80, backgroundColor: '#f1f1f1' },
  recipeInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  recipeName: { fontSize: 16, fontWeight: '600', color: '#2d3436' },
  recipeCategory: { fontSize: 13, color: '#666' },
  removeButton: { padding: 12, justifyContent: 'center' },

  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16 },

  logoutButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#ffeaea',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
    marginLeft: 8,
  },
});

export default ProfileScreen;
