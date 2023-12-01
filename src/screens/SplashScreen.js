// SplashScreen.js
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Simulate async task (e.g., fetching authentication token)
        // Replace with your actual async logic
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const authToken = await AsyncStorage.getItem(
          "ngx-webstorage-authenticationToken"
        );
        if (authToken) {
          navigation.replace("Home");
        } else {
          navigation.replace("SignIn");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        {/* Logo */}
        <Image
          source={require("../assets/images/logo-eprom.png")}
          style={styles.logo}
        />

        {/* Loading indicator */}
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#081A51",
  },
  background: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300, // Adjust the width of your logo
    height: 70, // Adjust the height of your logo
    marginBottom: 20,
  },
});

export default SplashScreen;
