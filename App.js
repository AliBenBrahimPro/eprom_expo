// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import SignInScreen from './src/screens/Auth/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import InviteSurveys from './src/screens/Surveys/InviteSurveys';
import QuizScreen from './src/screens/invitation/QuizScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // screenOptions={{
        //   headerShown: false,
        // }}
        initialRouteName="Splash" // Set SplashScreen as the initial route
      >
        <Stack.Screen options={{
          headerShown: false,
        }} name="Splash" component={SplashScreen} />
        <Stack.Screen options={{
          headerShown: false,
        }} name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerShown: false,
        }}  />
        <Stack.Screen screenOptions={{
          headerShown: true,
        }} name="InviteSurveys" component={InviteSurveys} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} screenOptions={{
          headerShown: true,
        }}  options={{ title: 'Questions' }} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
