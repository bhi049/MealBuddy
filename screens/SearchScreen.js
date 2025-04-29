import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Keyboard,
} from 'react-native';
import { SavedMealsContext } from '../hooks/useSavedMeals';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const { savedMeals, addMeal, removeMeal } = useContext(SavedMealsContext);
  const navigation = useNavigation();

  const { theme } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchMeals = async () => {
      if (!query) {
        setMeals([]);
        return;
      }

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );
        const data = await response.json();
        setMeals(data.meals || []);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchMeals();
  }, [query]);

  const handleSearchSubmit = () => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
    Keyboard.dismiss();
  };

  const isFavorite = (mealId) => {
    return savedMeals.some((meal) => meal.idMeal === mealId);
  };

  const toggleFavorite = (meal) => {
    if (isFavorite(meal.idMeal)) {
      removeMeal(meal.idMeal);
    } else {
      addMeal(meal);
    }
  };

  const renderMeal = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: currentTheme.surface }]}
      onPress={() => navigation.navigate('MealDetail', { meal: item })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: currentTheme.text }]}>{item.strMeal}</Text>
          <Text style={[styles.category, { color: currentTheme.subtext }]}>
            {item.strCategory} • {item.strArea}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: isFavorite(item.idMeal)
              ? currentTheme.accent
              : currentTheme.inputBackground,
          }}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item);
          }}
        >
          <Feather
            name="heart"
            size={20}
            color={isFavorite(item.idMeal) ? '#fff' : currentTheme.accent}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity
      style={[styles.recentSearchItem, { backgroundColor: currentTheme.surface }]}
      onPress={() => setQuery(item)}
    >
      <Feather name="clock" size={16} color={currentTheme.subtext} style={{ marginRight: 8 }} />
      <Text style={[styles.recentSearchText, { color: currentTheme.text }]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentTheme.surface,
            color: currentTheme.text,
            borderColor: currentTheme.border,
          },
        ]}
        placeholder="Search recipes..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearchSubmit}
        autoCapitalize="none"
        placeholderTextColor={currentTheme.subtext}
        returnKeyType="search"
      />

      {query.length === 0 && recentSearches.length > 0 ? (
        <View>
          <Text style={[styles.recentTitle, { color: currentTheme.text }]}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => `recent_${index}`}
            renderItem={renderRecentSearch}
          />
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderMeal}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Feather name="search" size={48} color={currentTheme.subtext} />
              <Text style={[styles.emptyText, { color: currentTheme.subtext }]}>No recipes found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#f1f1f1',
  },
  info: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentSearchText: {
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});

export default SearchScreen;
