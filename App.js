import 'react-native-gesture-handler'; // Import necessário para react-native-gesture-handler
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ListRoutesScreen from './screens/ListRoutesScreen';
import RouteDetailScreen from './screens/DisplayRouteScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ListRoutes" component={ListRoutesScreen} />
        <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}