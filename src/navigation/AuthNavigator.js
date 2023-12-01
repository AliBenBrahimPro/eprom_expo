import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/Auth/SignInScreen';


const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }} initialRouteName="SignIn" headerMode="none">
      <Stack.Screen  name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Add other screens as needed */}
    </Stack.Navigator>
  );
}

export default AuthNavigator;
