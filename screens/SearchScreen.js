import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { SavedMealsContext } from '../hooks/useSavedMeals';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; // Add Feather for consistent icons

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
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
      onPress={() => navigation.navigate('MealDetail', { meal: item })} // Ensure correct navigation
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search recipes..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderMeal}
        showsVerticalScrollIndicator={false}
      />
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
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  image: {
    width: 80,
    height: 80,
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
    fontWeight: '600',
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
});

export default SearchScreen;
