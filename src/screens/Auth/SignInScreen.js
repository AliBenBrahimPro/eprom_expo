// Import necessary dependencies
import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image
  
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Background image source
const backgroundImage = require('../../assets/images/background.png');
const logoImage = require('../../assets/images/logo-eprom.png'); // Replace with the actual path to your logo image

// Your component
const SignInScreen = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Use the useNavigation hook to access the navigation object



  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8085/api/authenticate', {
        username: emailOrPhone,
        password: password,
      });

      // Save token to local storage
      await AsyncStorage.setItem('ngx-webstorage-authenticationToken', response.data.id_token);

      // Fetch user account information using the obtained token
      const accountInfoResponse = await axios.get('http://10.0.2.2:8085/api/account', {
        headers: {
          Authorization: `Bearer ${response.data.id_token}`,
        },
      });

      // Save account information to local storage
      await AsyncStorage.setItem('ngx-webstorage-accountInfo', JSON.stringify(accountInfoResponse.data));

      Alert.alert('Success', 'Sign in successful!', [{ text: 'OK' }]);

      // Navigate to home screen
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Error signing in. Please try again.', [{ text: 'OK' }]);
    }
  };
  return (

    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {/* Logo and Header */}
        <View style={styles.header}>
          {/* Your logo component goes here */}
          <Image source={logoImage} style={styles.logo} />

        </View>

        {/* Card with Inputs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>Enter your credentials to access your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Sign in with your email or your phone number"
            onChangeText={(text) => setEmailOrPhone(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>Don't have an account? Register</Text>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// Set navigationOptions to disable the header
SignInScreen.navigationOptions = {
  header: null,
};
const styles = StyleSheet.create({
  logo: {
    width: 280, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    marginBottom: 10,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    color: 'white',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubtitle: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerText: {
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: 'blue',
    textAlign: 'center',
  },
});

export default SignInScreen;
