// hooks/SavedMealsContext.js
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../supabase';
import { AuthContext } from './useAuth';

export const SavedMealsContext = createContext();

export const SavedMealsProvider = ({ children }) => {
  const [savedMeals, setSavedMeals] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const fetchSavedMeals = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('saved_meals')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Table might be empty
        console.error('Error fetching saved meals:', error);
      } else {
        setSavedMeals(data?.saved_meals || []);
      }
    };

    fetchSavedMeals();
  }, [user]);

  const saveMealsToSupabase = async (meals) => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .upsert({ id: user.id, saved_meals: meals });

    if (error) {
      console.error('Error saving meals to Supabase:', error);
    } else {
      setSavedMeals(meals);
    }
  };

  const addMeal = async (meal) => {
    const updatedMeals = [...savedMeals, meal];
    await saveMealsToSupabase(updatedMeals);
  };

  const removeMeal = async (mealId) => {
    const updatedMeals = savedMeals.filter((meal) => meal.idMeal !== mealId);
    await saveMealsToSupabase(updatedMeals);
  };

  return (
    <SavedMealsContext.Provider value={{ savedMeals, addMeal, removeMeal }}>
      {children}
    </SavedMealsContext.Provider>
  );
};
