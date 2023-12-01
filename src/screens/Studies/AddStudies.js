import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddStudy = () => {
  const [studyTitle, setStudyTitle] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      // Retrieve the token from local storage
      const authToken = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');
  
      // Make the Axios request with the token in the headers
      const response = await axios.get('http://10.0.2.2:8085/api/surveys', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Other headers if needed
        },
      });

      // Handle the response
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };
  
  // Call the function to fetch data with the token
  useEffect(() => {
    // Fetch surveys from the API
    fetchData();
  }, []);

  const handleSave = async () => {
    // Prepare payload
    const payload = {
      title: studyTitle,
      surveys: [
        {
          id: selectedSurvey.id,
          title: selectedSurvey.title,
          topic: selectedSurvey.topic,
          description: selectedSurvey.description,
          createdBy: selectedSurvey.createdBy,
          createdDate: selectedSurvey.createdDate,
          lastModifiedBy: selectedSurvey.lastModifiedBy,
          lastModifiedDate: selectedSurvey.lastModifiedDate,
          isArchived: selectedSurvey.isArchived,
          archivedDate: selectedSurvey.archivedDate,
          questions: selectedSurvey.questions.map(question => ({
            id: question.id,
            text: question.text,
            createdBy: question.createdBy,
            createdDate: question.createdDate,
            lastModifiedBy: question.lastModifiedBy,
            lastModifiedDate: question.lastModifiedDate,
            language: question.language,
            answerChoices: question.answerChoices.map(choice => ({
              id: choice.id,
              text: choice.text,
              createdBy: choice.createdBy,
              createdDate: choice.createdDate,
              lastModifiedBy: choice.lastModifiedBy,
              lastModifiedDate: choice.lastModifiedDate,
              isArchived: choice.isArchived,
              archivedDate: choice.archivedDate,
            })),
            typeQuestion: {
              id: question.typeQuestion.id,
              text: question.typeQuestion.text,
              createdBy: question.typeQuestion.createdBy,
              createdDate: question.typeQuestion.createdDate,
              lastModifiedBy: question.typeQuestion.lastModifiedBy,
              lastModifiedDate: question.typeQuestion.lastModifiedDate,
              isArchived: question.typeQuestion.isArchived,
              archivedDate: question.typeQuestion.archivedDate,
            },
          })),
        },
      ],
    };

    const authToken = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

    // Send POST request to the API
    axios.post('http://10.0.2.2:8085/api/study', payload ,{
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Other headers if needed
      },
    })
      .then(response => {
        console.log('Study added successfully:', response.data);
        // Navigate to the desired screen (e.g., ListStudies)
        navigation.navigate('ListStudies');
      })
      .catch(error => console.error('Error adding study:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Study Title:</Text>
      <TextInput
        style={styles.input}
        value={studyTitle}
        onChangeText={text => setStudyTitle(text)}
        placeholder="Enter study title"
      />

      <Text style={styles.label}>Select Survey:</Text>
      <SelectList 
        setSelected={(val) => setSelectedSurvey(val)} 
        data={surveys.map(survey => ({
          value: survey.title,
          key: survey
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AddStudy;
