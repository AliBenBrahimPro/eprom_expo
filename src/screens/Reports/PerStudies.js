import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

const PerStudies = () => {
  const [data, setData] = useState([]);
 


  const fetchStudies = async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/study", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data from the API

    fetchStudies();
 
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const renderCard = (text, index,number) => (
    <View key={index} style={styles.card}>
      {/* Your icon component goes here */}
      <Icon name="book" size={30} color="black" />

      <Text style={styles.number}>{number}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
     { renderCard("Number of Studies", 0,data.length)}

  

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

export default PerStudies;
