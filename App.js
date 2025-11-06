import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ApplyScreen from './src/screens/ApplyScreen';
import CardsScreen from './src/screens/CardsScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoanCalculatorScreen from './src/screens/LoanCalculatorScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Apply') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00D9B5',
        tabBarInactiveTintColor: '#8F92A1',
        tabBarStyle: {
          backgroundColor: '#1E2337',
          borderTopColor: '#2A2F4A',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Apply" component={ApplyScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#151828' },
          }}
        >
          {isFirstLaunch && (
            <Stack.Screen name="Onboarding">
              {props => (
                <OnboardingScreen
                  {...props}
                  onComplete={() => setIsFirstLaunch(false)}
                />
              )}
            </Stack.Screen>
          )}
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="LoanCalculator" component={LoanCalculatorScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="LoanDetails" component={LoanDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}