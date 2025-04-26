import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Image, Keyboard } from 'react-native';
import { SavedMealsContext } from '../hooks/useSavedMeals';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const { savedMeals, addMeal, removeMeal } = useContext(SavedMealsContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMeals = async () => {
      if (!query) {
        setMeals([]);
        return;
      }

      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
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
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]); // max 5 muistissa
    }
    Keyboard.dismiss(); // Piilota näppäimistö enterin jälkeen
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
      style={styles.card}
      onPress={() => navigation.navigate('MealDetail', { meal: item })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.strMeal}</Text>
          <Text style={styles.category}>{item.strCategory} • {item.strArea}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite(item.idMeal) && styles.favoriteButtonActive,
          ]}
          onPress={() => toggleFavorite(item)}
        >
          <Feather
            name="heart"
            size={20}
            color={isFavorite(item.idMeal) ? '#fff' : '#ff6b6b'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity style={styles.recentSearchItem} onPress={() => {
      setQuery(item);
    }}>
      <Feather name="clock" size={16} color="#999" style={{ marginRight: 8 }} />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search recipes..."
        value={query}
        onChangeText={setQuery} // <-- heti kun kirjoitetaan, fetch alkaa
        onSubmitEditing={handleSearchSubmit} // <-- enterillä tallennetaan recentSearch
        autoCapitalize="none"
        placeholderTextColor="#aaa"
        returnKeyType="search"
      />

      {query.length === 0 && recentSearches.length > 0 ? (
        <View>
          <Text style={styles.recentTitle}>Recent Searches</Text>
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
              <Feather name="search" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No recipes found</Text>
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
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    fontSize: 16,
    color: '#2d3436',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    color: '#2d3436',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
  },
  favoriteButtonActive: {
    backgroundColor: '#ff6b6b',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
    marginLeft: 4,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#2d3436',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default SearchScreen;
