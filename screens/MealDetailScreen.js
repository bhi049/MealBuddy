import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const MealDetailScreen = ({ route, navigation }) => {
  const { meal } = route.params;

  // Format ingredients and measurements into a clean array
  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
    return ingredients;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{meal.strCategory}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.category}>{meal.strArea}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {getIngredients().map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>
                {item.measure} {item.ingredient}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {meal.strInstructions.split('\r\n').map((instruction, index) => (
            instruction.trim() && (
              <View key={index} style={styles.instructionRow}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction.trim()}</Text>
              </View>
            )
          ))}
        </View>

        {meal.strYoutube && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Tutorial</Text>
            <TouchableOpacity style={styles.youtubeButton}>
              <Feather name="youtube" size={20} color="#ff6b6b" />
              <Text style={styles.youtubeText}>Watch on YouTube</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  category: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  dot: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff6b6b',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: 8,
  },
  youtubeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
});

export default MealDetailScreen; 