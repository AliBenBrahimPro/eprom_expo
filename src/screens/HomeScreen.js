import * as React from "react";
import {
  ScrollView,
  Button,
  ImageBackground,
  View,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import ListStudies from "./Studies/ListStudies";
import AddStudy from "./Studies/AddStudies";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditStudy from "./Studies/EditStudies";
import ListSurveys from "./Surveys/ListSurvey";
import ListQuetions from "./Questions/ListQuestions";
import AddSurveys from "./Surveys/AddSurveys";
import AddQuestions from "./Questions/AddQuestions";
import ListConfiguration from "./Questions/ListConfiguration";
import AddConfiguration from "./Questions/AddConfiguration";
import PerUsers from "./Reports/PerUsers";
import PerSurveys from "./Reports/PerSurveys";
import PerStudies from "./Reports/PerStudies";
import { useIsFocused } from "@react-navigation/native";
import ListInvitation from "./invitation/ListInvitation";
import EditSurveys from "./Surveys/EditSurveys";
import EditConfiguration from "./Questions/EditConfiguration";

const mainDrawerColor = "#081A51";
const subItemColor = "#1D1B31";

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: mainDrawerColor,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: "100%",
    height: 50,
    marginRight: 10,
  },

  drawerItem: {
    backgroundColor: subItemColor,
    color: "white",
  },
  drawerLabel: {
    color: "white",
  },
  expandableItem: {
    backgroundColor: mainDrawerColor,
  },
  expandableLabel: {
    color: "white",
  },
  drawerFooter: {
    marginTop: "auto",
    backgroundColor: mainDrawerColor,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    marginLeft: 10,
  },
});

function MainScreen({ navigation }) {
  const isFocused = useIsFocused();

  React.useEffect(() => {

  }, [isFocused])
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    container: {
      flex: 1,
    },
    section: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start', // Align text to the left
      padding: 20,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white',
      textAlign: 'left', // Align text to the left
    },
    descriptionContainer: {
      width: '75%', // Adjust the width as needed
    },
    description: {
      textAlign: 'left',
      color: 'white',
    },
  })
  return (
    <ScrollView style={styles.container}>
    {/* About e-PROM Section */}
    <ImageBackground
      source={require('../assets/images/epromImage.png')}
      style={styles.background}
      >
      <View style={styles.section}>
        <Text style={styles.title}>About e-PROM</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Patient-Reported Outcome Measures (PROMs) assess the disease symptoms, overall health, and Quality of Life (QoL) from the patient perspective. In our era of wearable and remote monitoring of physical health, I-DAIR envisions assessment methods that would be directly integrated into patient-owned connected devices, with the goal to ease monitoring and avoid interference, such as questionnaire fatigue, recall bias, improper outcome analyses, cultural variations or language barriers.
          </Text>
        </View>
      </View>
    </ImageBackground>

    {/* About I-DAIR Section */}
    <ImageBackground
      source={require('../assets/images/idairImage.png')}
      style={styles.background}
    >
      <View style={styles.section}>
        <Text style={styles.title}>About I-DAIR</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Patient-Reported Outcome Measures (PROMs) assess the disease symptoms, overall health, and Quality of Life (QoL) from the patient perspective. In our era of wearable and remote monitoring of physical health, I-DAIR envisions assessment methods that would be directly integrated into patient-owned connected devices, with the goal to ease monitoring and avoid interference, such as questionnaire fatigue, recall bias, improper outcome analyses, cultural variations or language barriers.
          </Text>
        </View>
      </View>
    </ImageBackground>

    {/* Contact Us Section */}
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
    >
      <View style={styles.section}>
        <Text style={styles.title}>Contact Us</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Provide your contact information or a contact form here.
          </Text>
        </View>
      </View>
    </ImageBackground>
  </ScrollView>
    
  );
}
function ExpandableListItem({ title, items, navigation }) {
  const [expanded, setExpanded] = React.useState(false);
  const navigationRoute = useNavigation();

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleItemPress = (item) => {
    console.log("Selected item:", item);
    if (item === "Studies List") {
      navigationRoute.navigate("ListStudies");
    } else if (item === "Add Study") {
      navigationRoute.navigate("AddStudy");
    } else if (item === "Survey List") {
      navigationRoute.navigate("ListSurvey");
    } else if (item === "Questions List") {
      navigationRoute.navigate("ListQuestions");
    } else if (item === "Add Survey") {
      navigationRoute.navigate("AddSurveys");
    } else if (item === "Add Questions") {
      navigationRoute.navigate("AddQuestions");
    } else if (item === "List Configuration") {
      navigationRoute.navigate("ListConfiguration");
    } else if (item === "Add Configuration") {
      navigationRoute.navigate("AddConfiguration");
    } else if (item === "Per users") {
      navigationRoute.navigate("PerUsers");
    } else if (item === "Per Surveys") {
      navigationRoute.navigate("PerSurveys");
    } else if (item === "Per Studies") {
      navigationRoute.navigate("PerStudies");
    } else if (item === "Dashboard") {
      navigationRoute.navigate("Main");
    }
  };

  return (
    <List.Accordion
      title={title}
      expanded={expanded}
      titleStyle={{ color: "white" }}
      onPress={handlePress}
      style={{ color: "red", backgroundColor: mainDrawerColor }}
      labelStyle={{ color: "white" }}
    >
      {items.map((item) => (
        <List.Item
          key={item}
          title={item}
          onPress={() => handleItemPress(item)}
          style={{ backgroundColor: subItemColor, color: "white" }}
          labelStyle={{ color: "white" }}
          titleStyle={{ color: "white", fontSize: 12 }}
        />
      ))}
    </List.Accordion>
  );
}

function CustomDrawerHeader() {


  return (
    <View style={styles.drawerHeader}>
      <Image
        source={require("../assets/images/logo-eprom.png")}
        style={styles.headerLogo}
      />
    </View>
  );
}
function CustomDrawerFooter({ navigation }) {

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout pressed");
  
    // Clear the authentication token from AsyncStorage
    AsyncStorage.removeItem("ngx-webstorage-authenticationToken")
      .then(() => {
        // Clear the account information from AsyncStorage
        return AsyncStorage.removeItem("ngx-webstorage-accountInfo");
      })
      .then(() => {
        console.log("Logout successful");
        // For example, you can navigate to the login screen
        navigation.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        });      })
      .catch((error) => {
        console.error("Error clearing AsyncStorage:", error);
      });
  };
  

  return (
    <View style={styles.drawerFooter}>
      {/* Add your logout icon here */}
      <Icon name="logout" size={30} color="white" />

      {/* <Icon name="logout" size={24} color="white" /> */}
      <Text style={styles.footerText} onPress={handleLogout}>
        Logout
      </Text>
    </View>
  );
}

function CustomDrawerContent({ navigation }) {
  const [authorities, setAuthorities] = React.useState([]);
  React.useEffect(() => {
    // Fetch authorities from AsyncStorage
    AsyncStorage.getItem('ngx-webstorage-accountInfo')
      .then((accountInfo) => {
        if (accountInfo) {
          const parsedInfo = JSON.parse(accountInfo);
          setAuthorities(parsedInfo.authorities || []);
          console.log(`Parsed info: ${parsedInfo.authorities}`);
        }
      })
      .catch((error) => {
        console.error('Error fetching authorities from AsyncStorage:', error);
      });
  }, []);
  const hasAuthority = (authority) => authorities.includes(authority);
  console.log('hasAuthority', hasAuthority(authorities));
  return (
    <ScrollView>
      <DrawerContentScrollView
        contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
      >
        {/* Custom Drawer Header */}
        <CustomDrawerHeader />

        {/* Your existing drawer items */}
        <DrawerItem
          label="Dashboard"
          onPress={() => navigation.navigate("Main")}
          style={{
            backgroundColor: mainDrawerColor,
            color: "white",
          }}
          labelStyle={styles.drawerLabel}
        />
 {hasAuthority("ROLE_STUDY_COORDINATOR") && (
          // Display these items only if the user has "Admin" authority
          <>
        {/* Expandable List Item */}
        <ExpandableListItem
          title="Studies"
          items={["Studies List", "Add Study"]}
          navigation={navigation}
        />
        <ExpandableListItem
          title="Surveys"
          items={["Survey List", "Add Survey"]}
          navigation={navigation}
        />
        <ExpandableListItem
          title="Questions"
          items={[
            "Questions List",
            "Add Questions",
            "List Configuration",
            "Add Configuration",
          ]}
          navigation={navigation}
        />
        <ExpandableListItem
          title="Reports"
          items={["Per users", "Per Surveys", "Per Studies"]}
          navigation={navigation}
        /></>)}
 {hasAuthority("ROLE_PATIENT") && (
          // Display these items only if the user has "Admin" authority
          <>
        {/* Expandable List Item */}
        <DrawerItem
          label="Invitations"
          onPress={() => navigation.navigate("ListInvitation")}
          style={{
            backgroundColor: mainDrawerColor,
            color: "white",
          }}
          labelStyle={styles.drawerLabel}
        /></>)}
        <CustomDrawerFooter navigation={navigation} />
      </DrawerContentScrollView>
    </ScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function HomeScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: mainDrawerColor,
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Main" component={MainScreen}  />
      <Drawer.Screen name="ListStudies" component={ListStudies} />
      <Drawer.Screen name="AddStudy" component={AddStudy} />
      <Drawer.Screen name="EditStudy" component={EditStudy} />
      <Drawer.Screen name="EditSurveys" component={EditSurveys} />
      <Drawer.Screen name="EditConfiguration" component={EditConfiguration} />

      <Drawer.Screen name="ListSurvey" component={ListSurveys} />
      <Drawer.Screen name="ListQuestions" component={ListQuetions} />
      <Drawer.Screen name="AddSurveys" component={AddSurveys} />

      <Drawer.Screen name="AddQuestions" component={AddQuestions} />
      <Drawer.Screen name="ListConfiguration" component={ListConfiguration} />
      <Drawer.Screen name="AddConfiguration" component={AddConfiguration} />
      <Drawer.Screen name="PerUsers" component={PerUsers} />
      <Drawer.Screen name="PerSurveys" component={PerSurveys} />
      <Drawer.Screen name="PerStudies" component={PerStudies} />
      <Drawer.Screen name="ListInvitation" component={ListInvitation} />

    </Drawer.Navigator>
  );
}
