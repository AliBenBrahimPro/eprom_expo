import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

const PerUsers = () => {
  const [data, setData] = useState([]);
  const [userNumber, setUserNumber] = useState(0);
  const [admin, setAdmin] = useState([]);
  const [userCordinate, setUserCordinate] = useState([]);


  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/reports/users-number", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserNumber(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchAdmin = async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/reports/admins-list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchuserCordinate= async () => {
    try {
      const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

      const response = await axios.get("http://10.0.2.2:8085/api/reports/study-coordinators-list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCordinate(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');

        const response = await axios.get("http://10.0.2.2:8085/api/reports/patients-list", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUser();
    fetchData();
    fetchAdmin();
    fetchuserCordinate();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const renderCard = (text, index,number) => (
    <View key={index} style={styles.card}>
      {/* Your icon component goes here */}
      <Icon name="user-circle-o" size={30} color="black" />

      <Text style={styles.number}>{number}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
     { renderCard("Total Number of Users", 0,userNumber)}
     { renderCard("Number of Patients", 1,data.length)}

   
      { renderCard("Users with Admin authority", 2,admin.length)}
      { renderCard("Users with Study Coo. authority", 3,userCordinate.length)}

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

export default PerUsers;
