import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
  StyleSheet
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

const ListQuetions = () => {
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
        const token = await AsyncStorage.getItem(
          "ngx-webstorage-authenticationToken"
        );
        // Add the token to the request headers
        const response = await axios.get("http://10.0.2.2:8085/api/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data,isFocused]);
  const renderSurveyItem = ({ item }) => (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        padding: 15,
        marginBottom: 10,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
        Question: {item.text}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Creator: {item.createdBy}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>
        Language: {item.language}
      </Text>

      <Text style={{ fontSize: 14, color: "#888" }}>
        Date Created:{" "}
        {moment(selectedStudy?.createdDate).format("MMMM D, YYYY")}
      </Text>

      {/* Action buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={() => handleDetails(item)}>
          <Text style={{ color: "blue" }}>Details</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text style={{ color: "green" }}>Edit</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => handleRemove(item)}>
          <Text style={{ color: "red" }}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleDetails = (item) => {
    setSelectedStudy(item);
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    // Navigate to the EditStudy screen with the study details
    navigation.navigate("EditStudy", { itemId: item.id });
  };

  const handleRemove = (item) => {
    // Prompt for confirmation before deleting
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this survey?\nThis action is irreversible!",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteSurvey(item.id) },
      ]
    );
  };

  const deleteSurvey = async (surveyId) => {
    try {
      // Retrieve the token from local storage
      const token = await AsyncStorage.getItem(
        "ngx-webstorage-authenticationToken"
      );

      // Add the token to the request headers
      await axios.delete(`http://10.0.2.2:8085/api/questions/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the data state to reflect the deleted survey
      setData((prevData) =>
        prevData.filter((survey) => survey.id !== surveyId)
      );
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with opacity
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%', // Adjust the width as needed
    },
  });
  
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              Question
            </Text>
            <Text>Title: {selectedStudy?.text}</Text>
            <Text>Language: {selectedStudy?.language}</Text>
            <Text>Type: {selectedStudy?.typeQuestion.text}</Text>

            <Text>Creator: {selectedStudy?.createdBy}</Text>
            <Text>
              Date Created:{" "}
              {moment(selectedStudy?.createdDate).format("MMMM D, YYYY")}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>
              Choices:
            </Text>
            {selectedStudy?.answerChoices.map((answerChoice, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                <Text>- {answerChoice.text}</Text>
              </View>
            ))}
            <View style={{  marginTop: 10 }}>

            <Button   title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

};

export default ListQuetions;
