// navigation/MainNavigator.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { View, ActivityIndicator, Platform } from 'react-native';

import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SearchScreen from '../screens/SearchScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { AuthContext } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const defaultStackOptions = {
  headerStyle: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  headerBackTitleVisible: false,
  headerTintColor: '#ff6b6b',
};

const DiscoverStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function DiscoverStackScreen() {
  return (
    <DiscoverStack.Navigator
      screenOptions={{
        ...defaultStackOptions,
        headerBackTitle: 'Discover', // Set back button label
      }}
    >
      <DiscoverStack.Screen name="DiscoverMain" component={DiscoverScreen} options={{ headerShown: false }} />
      <DiscoverStack.Screen name="MealDetail" component={MealDetailScreen} options={{ headerShown: true }} />
    </DiscoverStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        ...defaultStackOptions,
        headerBackTitle: 'Search', // Set back button label
      }}
    >
      <SearchStack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="MealDetail" component={MealDetailScreen} options={{ headerShown: true }} />
    </SearchStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        ...defaultStackOptions,
        headerBackTitle: 'Profile', // Set back button label
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="MealDetail" component={MealDetailScreen} options={{ headerShown: true }} />
    </ProfileStack.Navigator>
  );
}

export default function MainNavigator() {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
              if (route.name === 'Discover') {
                return <Feather name="compass" size={24} color={color} />;
              } else if (route.name === 'Search') {
                return <Feather name="search" size={24} color={color} />;
              } else if (route.name === 'Profile') {
                return <Feather name="user" size={24} color={color} />;
              }
            },
            tabBarActiveTintColor: '#ff6b6b',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#f1f1f1',
              paddingBottom: 8,
              paddingTop: 8,
              height: 60,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 8,
                },
              }),
            },
          })}
        >
          <Tab.Screen name="Discover" component={DiscoverStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={defaultStackOptions}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
