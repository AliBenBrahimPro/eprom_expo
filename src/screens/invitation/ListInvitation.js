import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button,Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";

const ListInvitation = () => {
  const [data, setData] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    // Fetch data from the API with the token
    const fetchData = async () => {
      try {
        // Retrieve the token from local storage
        const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');
        const email = await AsyncStorage.getItem('ngx-webstorage-accountInfo');
        // Parse the email if it's stored as JSON
        const parsedEmail = email ? JSON.parse(email).email : '';
        // Add the token to the request headers
        const response = await axios.get('http://10.0.2.2:8085/api/invitations/distinct/'+parsedEmail, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isFocused]);
  const renderSurveyItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 15, marginBottom: 10, backgroundColor: 'white' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>SURVEY TITLE   TO ANSWER: {item.survey.title}</Text>
    <Text style={{ fontSize: 16, marginBottom: 5 }}>SURVEY TOPIC: {item.survey.topic}</Text>
    <Text style={{ fontSize: 14, color: '#888' }}>Date Created: {moment(selectedStudy?.createdDate).format('MMMM D, YYYY')}</Text>
    <Text style={{ fontSize: 14, color: '#888' }}>SEND BY : {item.createdBy}</Text>

    {/* Action buttons */}
    <View style={{ flexDirection: 'row', justifyContent: 'end', marginTop: 10 }}>
    
  
      <TouchableOpacity onPress={() => handlePass(item)}>
        <Text style={{ color: 'blue' }}>Pass Survey</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
  const handleDetails = (item) => {
    setSelectedStudy(item);
    setModalVisible(true);
  };

  const handlePass = (item) => {
    // Navigate to the EditStudy screen with the study details
    navigation.navigate('QuizScreen', { surveyId: item.survey.id });
  };


  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSurveyItem}
      />

      {/* Modal for Study Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Study Details</Text>
    <Text>Study title: {selectedStudy?.title}</Text>
    <Text>Creator: {selectedStudy?.createdBy}</Text>
    <Text>Date Created: {moment(selectedStudy?.createdDate).format('MMMM D, YYYY')}</Text>

    <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Surveys:</Text>
    {selectedStudy?.surveys.map((survey, index) => (
      <View key={index} style={{ marginTop: 10 }}>
        <Text>Title: {survey.title}</Text>
        <Text>Topic: {survey.topic}</Text>
        <Text>Description: {survey.description}</Text>
      </View>
    ))}

    <Button title="Close" onPress={() => setModalVisible(false)} />
  </View>
</View>

      </Modal>
    </View>
  );
};

export default ListInvitation;
