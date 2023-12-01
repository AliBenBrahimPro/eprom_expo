import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const EditStudy = ({ route }) => {
  const { itemId } = route.params;
  const [studyTitle, setStudyTitle] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [surveysData, setSurveysData] = useState({});

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get(`http://10.0.2.2:8085/api/study/${itemId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSurveysData(response.data);
      setStudyTitle(response.data.title);
      console.log("id :",response.data);
      setSelectedSurvey(response.data.surveys[0]);
    } catch (error) {
      console.error('Error fetching study details:', error);
    }
  };


  const fetchSurveies = async () => {
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
    fetchData();
    fetchSurveies();
  }, [isFocused]);

  const handleEdit = async () => {
    const payload = {
      "archivedDate": surveysData?.archivedDate,
      "createdBy": surveysData?.createdBy,
      "createdDate": surveysData?.createdDate,
      "id": surveysData?.id,
      "isArchived": surveysData?.isArchived,
      "lastModifiedBy": null,
      "lastModifiedDate": null,
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
          questions: selectedSurvey.questions,
        },
      ],
    };
console.log("payload :",payload);
    const authToken = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

    axios.put(`http://10.0.2.2:8085/api/study/%20${itemId}`, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        
      },
    })
      .then(response => {
        console.log('Study updated successfully:', response.data);
        navigation.navigate('ListStudies');
      })
      .catch(error => console.error('Error updating study:', error));
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
 defaultOption={{ key:selectedSurvey, value:selectedSurvey?.title }}
         setSelected={(val) => setSelectedSurvey(val)} 
        
        data={surveys.map(survey => ({
    value: survey.title,
    key: survey, // Assuming that 'id' is a unique identifier for each survey
  }))}
  save="key"
/>

      <Button title="Save" onPress={handleEdit} />
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

export default EditStudy;
