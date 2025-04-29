import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SavedMealsContext } from '../hooks/useSavedMeals';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../constants/theme';

const DiscoverScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { savedMeals, addMeal, removeMeal } = useContext(SavedMealsContext);

  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const fetchRandomMeals = async () => {
    setLoading(true);
    try {
      const request = Array.from({ length: 10 }).map(() =>
        axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
      );
      const response = await Promise.all(request);
      const randomMeals = response.map(res => res.data.meals[0]);
      setMeals(randomMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = (meal) => {
    const isSaved = savedMeals.some((savedMeal) => savedMeal.idMeal === meal.idMeal);
    if (isSaved) {
      removeMeal(meal.idMeal);
    } else {
      addMeal(meal);
    }
  };

  const isMealSaved = (mealId) => {
    return savedMeals.some((meal) => meal.idMeal === mealId);
  };

  useEffect(() => {
    fetchRandomMeals();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={[styles.header, { backgroundColor: currentTheme.card, borderBottomColor: currentTheme.subtext }]}>
        <Text style={[styles.headerTitle, { color: currentTheme.text }]}>Discover New Recipes</Text>
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: currentTheme.inputBackground }]} 
          onPress={fetchRandomMeals} 
          disabled={loading}
        >
          <Feather name="refresh-cw" size={20} color={currentTheme.accent} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={currentTheme.accent} />
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item, index) => `discovery_${item.idMeal}_${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: currentTheme.card }]}
              onPress={() => navigation.navigate('MealDetail', { meal: item })}
            >
              <Image 
                source={{ uri: item.strMealThumb }} 
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.title, { color: currentTheme.text }]}>{item.strMeal}</Text>
                  <TouchableOpacity 
                    style={{
                      padding: 8,
                      borderRadius: 20,
                      backgroundColor: isMealSaved(item.idMeal)
                        ? currentTheme.accent
                        : currentTheme.inputBackground,
                    }}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSaveMeal(item);
                    }}
                  >
                    <Feather 
                      name="heart"
                      size={20}
                      color={isMealSaved(item.idMeal) ? '#fff' : currentTheme.accent}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.category, { color: currentTheme.subtext }]}>
                  {item.strCategory} • {item.strArea}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  image: { 
    width: '100%', 
    height: 200,
    backgroundColor: '#f1f1f1',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { 
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
  },
});

export default DiscoverScreen;
