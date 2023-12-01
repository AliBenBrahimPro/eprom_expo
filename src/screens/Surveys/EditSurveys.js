import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { useIsFocused } from "@react-navigation/native";
const EditSurveys = ({ route }) => {
    const { itemId } = route.params;
    const [surveysData, setSurveysData] = useState({});

  const [surveysTitle, setSurveysTitle] = useState("");
  const [surveysTopic, setSurveysTopic] = useState("");
  const [surveysDescripcition, setSurveysDescripcition] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [questions, setQuestions] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      // Retrieve the token from local storage
      const authToken = await AsyncStorage.getItem(
        "ngx-webstorage-authenticationToken"
      );

      // Make the Axios request with the token in the headers
      const response = await axios.get("http://10.0.2.2:8085/api/surveys/"+itemId, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Other headers if needed
        },
      });
setSurveysTitle(response.data.title)
setSurveysTopic(response.data.topic)
setSurveysDescripcition(response.data.description)
setSelectedQuestion( response.data.questions)
setSurveysData(response.data)
console.log("serveydata :", surveysData);
      // Handle the response
     // setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };
  const fetchQuestions = async () => {
    try {
      // Retrieve the token from local storage
      const authToken = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');
  
      // Make the Axios request with the token in the headers
      const response = await axios.get('http://10.0.2.2:8085/api/questions', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Other headers if needed
        },
      });

      // Handle the response
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  // Call the function to fetch data with the token
  useEffect(() => {
    // Fetch surveys from the API
    fetchData();
    fetchQuestions()
  }, [isFocused]);

  const handleSave = async () => {
    // Prepare payload
    const payload = {
        "archivedDate": surveysData?.archivedDate,
      "createdBy": surveysData?.createdBy,
      "createdDate": surveysData?.createdDate,
      "id": surveysData?.id,
      "isArchived": surveysData?.isArchived,
      "lastModifiedBy": null,
      "lastModifiedDate": null,
      title: surveysTitle,
      topic: surveysTopic,
      description: surveysDescripcition,
      questions: selectedQuestion,
    };

    const authToken = await AsyncStorage.getItem(
      "ngx-webstorage-authenticationToken"
    );

    // Send POST request to the API
    axios
      .put(`http://10.0.2.2:8085/api/surveys/%20${itemId}`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',

          // Other headers if needed
        },
      })
      .then((response) => {
        console.log("Study added successfully:", response.data);
        // Navigate to the desired screen (e.g., ListStudies)
        navigation.navigate("ListStudies");
      })
      .catch((error) => console.error("Error adding study:", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Survey Title:</Text>
      <TextInput
        style={styles.input}
        value={surveysTitle}
        onChangeText={(text) => setSurveysTitle(text)}
        placeholder="Enter study title"
      />
      <Text style={styles.label}>Survey Topic:</Text>

      <TextInput
        style={styles.input}
        value={surveysTopic}
        onChangeText={(text) => setSurveysTopic(text)}
        placeholder="Enter survey topic"
      />
      <Text style={styles.label}>Survey Description:</Text>

      <TextInput
        style={styles.input}
        value={surveysDescripcition}
        onChangeText={(text) => setSurveysDescripcition(text)}
        placeholder="Enter survey description"
      />

      <Text style={styles.label}>Select Survey:</Text>
      <MultipleSelectList
      defaultOption={selectedQuestion.map((question) => ({
        value: question.text,
        key: question,
      }))}
  setSelected={(val) => setSelectedQuestion(val)}
  data={questions.map((question) => ({
    value: question.text,
    key: question,
  }))}
  save="key"
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

export default EditSurveys;
