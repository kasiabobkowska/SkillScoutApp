import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import CareerDetailsScreen from './screens/CareerDetailsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'SkillScout' }}
        />
        <Stack.Screen
          name="CareerDetails"
          component={CareerDetailsScreen}
          options={({ route }) => ({ title: route.params.career.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
