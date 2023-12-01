import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddQuestions = () => {
  const [question, setQuestion] = useState("");
  const [selectedtypeQuestions, setSelectedTypeQuestions] = useState(null);

  const [typeQuestions, setTypeQuestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [choices, setChoices] = useState(["", ""]);
  const datalanguage = [
    { key: "1", value: "ENGLISH" },
    { key: "2", value: "HINDI" },
    { key: "3", value: "ARABIC" },
  ];

  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const authToken = await AsyncStorage.getItem(
        "ngx-webstorage-authenticationToken"
      );

      const response = await axios.get(
        "http://10.0.2.2:8085/api/type-questions",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setTypeQuestions(response.data);
    } catch (error) {
      console.error("Error fetching type questions:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("typeQuestions", typeQuestions);
    console.log("typeQuestions", selectedtypeQuestions);
  }, []);

  const handleSave = async () => {
    const payload = {
      text: question,
      language: selectedLanguage,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      isArchived: null,
      archivedDate: null,
      typeQuestion: selectedtypeQuestions,
      answerChoices: choices.map((choiceText, index) => {
        const pointsMatch = choiceText.match(/\((\d+) point[s]?\)/);
        const points = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;
  
        return {
          text: choiceText,
          createdBy: null,
          createdDate: new Date().toISOString(),
          lastModifiedBy: null,
          lastModifiedDate: null,
          isArchived: null,
          archivedDate: null,
        };
      }),
    };
console.log("payload", payload);
    const authToken = await AsyncStorage.getItem(
      "ngx-webstorage-authenticationToken"
    );

    axios
      .post("http://10.0.2.2:8085/api/questions", payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log("Question added successfully:", response.data);
        navigation.navigate("ListStudies");
      })
      .catch((error) => {
        console.error("Error adding study:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
          
          // Check if the response contains detailed error information
          if (error.response.headers['content-type'] === 'application/problem+json') {
            console.error("Problem details:", error.response.data);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up the request:", error.message);
        }
      });
      
  };

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };
  const handleChoiceChange = (index, text) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = text;
    setChoices(updatedChoices);
  };

  const validateChoiceFormat = (text) => {
    // Check if the input matches the specified format
    const pattern = /^[\w\s]+ \(\d+ point[s]?\)$/i;
    return pattern.test(text);
  };

  const renderHint = () => (
    <Text style={styles.hintText}>
      Hint: Enter choices in the format 'option (points)'
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Language:</Text>

      <SelectList
        setSelected={(val) => setSelectedLanguage(val)}
        data={datalanguage}
        save="value"
      />
      <Text style={styles.label}>Question Type:</Text>

      <SelectList
        setSelected={(val) => setSelectedTypeQuestions(val)}
        data={typeQuestions.map((typeQuestion) => ({
          value: typeQuestion.text,
          key: typeQuestion,
        }))}
        save="key"
      />
      <Text style={styles.label}>Question:</Text>

      <TextInput
        style={styles.input}
        value={question}
        onChangeText={(text) => setQuestion(text)}
        placeholder="What question would you like to ask?"
      />

      <Text style={styles.label}>Choices:</Text>
      {choices.map((choice, index) => (
        <View key={index} style={styles.choiceContainer}>
          <TextInput
            style={styles.choiceInput}
            value={choice}
            onChangeText={(text) => handleChoiceChange(index, text)}
            placeholder={`Choice ${index + 1}`}
            onBlur={() => {
              if (!validateChoiceFormat(choices[index])) {
                // If the format is invalid, reset the input and show a hint
                const updatedChoices = [...choices];
                updatedChoices[index] = "";
                setChoices(updatedChoices);
                // You may also show an alert or a message to inform the user
              }
            }}
          />
          <TouchableOpacity onPress={() => handleRemoveChoice(index)}>
            <Text style={styles.removeChoice}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      {renderHint()}

      <TouchableOpacity onPress={handleAddChoice}>
        <Text style={styles.addChoice}>+ Add Choice</Text>
      </TouchableOpacity>

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
  choiceContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  choiceInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  removeChoice: {
    color: "red",
  },
  addChoice: {
    color: "blue",
    marginTop: 10,
  },
});

export default AddQuestions;
