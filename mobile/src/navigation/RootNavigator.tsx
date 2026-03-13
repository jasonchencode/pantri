import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantryScreen from '@screens/PantryScreen';
import AddIngredientScreen from '@screens/AddIngredientScreen';
import MealIdeasScreen from '@screens/MealIdeasScreen';
import ReceiptScanScreen from '@screens/ReceiptScanScreen';
import WeeklyMealPlanScreen from '@screens/WeeklyMealPlanScreen';

export type RootStackParamList = {
  Pantry: undefined;
  AddIngredient: undefined;
  MealIdeas: undefined;
  ReceiptScan: undefined;
  WeeklyMealPlan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Pantry"
      screenOptions={{
        headerStyle: { backgroundColor: '#101010' },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: '#050509' }
      }}
    >
      <Stack.Screen
        name="Pantry"
        component={PantryScreen}
        options={{ title: 'Your Pantry' }}
      />
      <Stack.Screen
        name="AddIngredient"
        component={AddIngredientScreen}
        options={{ title: 'Add Ingredient' }}
      />
      <Stack.Screen
        name="MealIdeas"
        component={MealIdeasScreen}
        options={{ title: 'Meal Ideas' }}
      />
      <Stack.Screen
        name="ReceiptScan"
        component={ReceiptScanScreen}
        options={{ title: 'Scan receipt (MVP)' }}
      />
      <Stack.Screen
        name="WeeklyMealPlan"
        component={WeeklyMealPlanScreen}
        options={{ title: 'Weekly Plan' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

