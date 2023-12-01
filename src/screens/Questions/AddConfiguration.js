import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddConfiguration = () => {
  const [questionType, setQuestionType] = useState("");

  const navigation = useNavigation();




  const handleSave = async () => {
    // Prepare payload
    const payload = {
        text: questionType,
  
    };

    const authToken = await AsyncStorage.getItem(
      "ngx-webstorage-authenticationToken"
    );

    // Send POST request to the API
    axios
      .post("http://10.0.2.2:8085/api/type-questions", payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Other headers if needed
        },
      })
      .then((response) => {
        console.log("Study added successfully:", response.data);
        // Navigate to the desired screen (e.g., ListStudies)
        navigation.navigate("ListConfiguration");
      })
      .catch((error) => console.error("Error adding study:", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Survey Title:</Text>
      <TextInput
        style={styles.input}
        value={questionType}
        onChangeText={(text) => setQuestionType(text)}
        placeholder="Enter question type..."
      />
    

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AddConfiguration;
