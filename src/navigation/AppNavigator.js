import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ApplyScreen from '../screens/ApplyScreen';
import CardsScreen from '../screens/CardsScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoanCalculatorScreen from '../screens/LoanCalculatorScreen';
import PaymentScreen from '../screens/PaymentScreen';
import LoanDetailsScreen from '../screens/LoanDetailsScreen';

// Import hooks
import { useAuth } from '../context/AppContext';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Apply':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'Cards':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Activity':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundLight,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Apply"
        component={ApplyScreen}
        options={{
          tabBarLabel: 'Apply',
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          tabBarLabel: 'Cards',
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Stack Navigator
function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
        presentation: 'card',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="LoanCalculator"
        component={LoanCalculatorScreen}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="LoanDetails"
        component={LoanDetailsScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

// Root App Navigator
export default function AppNavigator() {
  const { isFirstLaunch } = useAuth();

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: COLORS.primary,
            background: COLORS.background,
            card: COLORS.backgroundCard,
            text: COLORS.textPrimary,
            border: COLORS.border,
            notification: COLORS.error,
          },
        }}
      >
        {isFirstLaunch ? <AuthNavigator /> : <MainNavigator />}
      </NavigationContainer>
    </>
  );
}

// Navigation helper functions
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute()?.name;
}
