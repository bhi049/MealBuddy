import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SavedMealsContext } from '../hooks/useSavedMeals';

const DiscoverScreen = ({ navigation }) => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const { savedMeals, addMeal, removeMeal } = useContext(SavedMealsContext);

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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover New Recipes</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={fetchRandomMeals} 
                    disabled={loading}
                >
                    <Feather name="refresh-cw" size={20} color="#ff6b6b" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#ff6b6b" />
            ) : (
                <FlatList
                    data={meals}
                    keyExtractor={(item, index) => `discovery_${item.idMeal}_${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.card}
                            onPress={() => navigation.navigate('MealDetail', { meal: item })}
                        >
                            <Image 
                                source={{ uri: item.strMealThumb }} 
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.title}>{item.strMeal}</Text>
                                    <TouchableOpacity 
                                        style={[
                                            styles.saveBtn,
                                            isMealSaved(item.idMeal) && styles.saveBtnActive
                                        ]} 
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleSaveMeal(item);
                                        }}
                                    >
                                        <Feather 
                                            name={isMealSaved(item.idMeal) ? "heart" : "heart"} 
                                            size={20} 
                                            color={isMealSaved(item.idMeal) ? "#fff" : "#ff6b6b"} 
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.category}>
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
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2d3436',
    },
    refreshButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff5f5',
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
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
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
        color: '#2d3436',
        flex: 1,
        marginRight: 16,
    },
    category: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    saveBtn: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#fff5f5',
    },
    saveBtnActive: {
        backgroundColor: '#ff6b6b',
    },
});

export default DiscoverScreen;
