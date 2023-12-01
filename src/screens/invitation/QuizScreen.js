import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const QuizScreen = ({ route }) => {
  const { surveyId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const navigation = useNavigation(); // Use the useNavigation hook to access the navigation object

  useEffect(() => {
    console.log(surveyId);
    const fetchQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');
        const email = await AsyncStorage.getItem('ngx-webstorage-accountInfo');
        // Parse the email if it's stored as JSON
        const parsedEmail = email ? JSON.parse(email).email : '';
        // Fetch questions based on survey ID
        const response = await axios.get(`http://10.0.2.2:8085/api/surveys-email/${parsedEmail}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const survey = response.data.find((item) => item.id === surveyId);
console.log(survey);

    if (survey) {
      setQuestions(survey.questions);
    } else {
      // Handle case where survey with the specified ID is not found
      console.error('Survey not found');
    }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [surveyId]);

  const handleAnswer = (choice) => {
    // Extract the points from the choice text
    const pointsMatch = choice.text.match(/\((\d+) point\)/);
    
    if (pointsMatch && pointsMatch[1]) {
      const points = parseInt(pointsMatch[1], 10);
      
      // Add the points to the total score
      setScore((prevScore) => prevScore + points);
      setSelectedChoice(choice);

    }
  
    // Continue with the rest of your answer handling logic...
  };
  

  const handleNextQuestion = () => {
    // Move to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    // Reset selected choice for the next question
    setSelectedChoice(null);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      // Quiz completed, show completion message or navigate to result screen
  
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Quiz Completed! Your score is {score}</Text>
        <TouchableOpacity style={{ opacity: 1 }} onPress={() => navigation.navigate('ListInvitation')}>
          <Text style={{ fontSize: 20, color: 'blue' }}>Beck to List Invitation</Text>
        </TouchableOpacity>
      </View>
      );
    }
    const styles = StyleSheet.create({
        questionContainer: {
          padding: 20,
          margin: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          width: '90%',
        },
        questionText: {
          fontSize: 18,
          marginBottom: 10,
        },
        choicesContainer: {
          marginTop: 10,
        },
        choiceButton: {
          backgroundColor: 'gray',
          padding: 10,
          marginVertical: 5,
          borderRadius: 5,
        },
        choiceButtonText: {
          color: 'white',
          fontWeight: 'bold',
        },
        nextButton: {
          backgroundColor: 'blue',
          padding: 10,
          marginTop: 10,
          borderRadius: 5,
        },
        nextButtonText: {
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
        },
      });
      

    return (
<View style={styles.questionContainer}>
  <Text style={styles.questionText}>{currentQuestion.text}</Text>
  
  <View style={styles.choicesContainer}>
    {currentQuestion.answerChoices.map((choice) => (
      <TouchableOpacity
        key={choice.id}
        onPress={() => handleAnswer(choice)}
        style={[
          styles.choiceButton,
          {
            backgroundColor: selectedChoice === choice ? 'green' : 'gray',
          },
        ]}
      >
        <Text style={styles.choiceButtonText}>{choice.text}</Text>
      </TouchableOpacity>
    ))}
  </View>

  <TouchableOpacity
    onPress={handleNextQuestion}
    style={styles.nextButton}
  >
    <Text style={styles.nextButtonText}>Next Question</Text>
  </TouchableOpacity>
</View>

    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {renderQuestion()}
    </View>
  );
};

export default QuizScreen;
