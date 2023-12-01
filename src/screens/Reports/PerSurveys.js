import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

const PerSurveys = () => {
  const [data, setData] = useState([]);
  const [surveysNumber, setSurveysNumber] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [questions, setQuestions] = useState(0);


  const fetchSurveys = async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/reports/surveys-number", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSurveysNumber(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchAnswer = async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/reports/answer-total-number", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnswer(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchQuestions= async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/reports/questions-number", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Fetch data from the API

    fetchSurveys();
    fetchAnswer();
    fetchQuestions();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const renderCard = (text, index,number,icon) => (
    <View key={index} style={styles.card}>
      {/* Your icon component goes here */}
      <Icon name={icon} size={30} color="black" />

      <Text style={styles.number}>{number}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
     { renderCard("Number of Surveys", 0,surveysNumber,"th-list")}

   
      { renderCard("Number of Survey Answered", 1,answer,"sticky-note")}
      { renderCard("Number of Questions", 2,questions,"question")}

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    card: {
      backgroundColor: '#fff',
      padding: 20,
      marginBottom: 10,
      borderRadius: 10,
      elevation: 2,
      alignItems: 'center',
    },
    number: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
    },
    text: {
      fontSize: 16,
      marginTop: 5,
    },
  });

export default PerSurveys;
