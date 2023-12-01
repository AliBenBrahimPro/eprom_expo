import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TimePicker,
  MultiSelectPicker,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  emailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  emailInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  removeButton: {
    color: "red",
    marginLeft: 10,
  },
  addButton: {
    color: "blue",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioGroupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonText: {
    marginLeft: 5,
  },
  dropdownContainer: {
    height: 40,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textInput: {
    fontSize: 16,
  },
});

const InviteSurveys = () => {
  const [schedulingOption, setSchedulingOption] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [validity, setValidity] = useState("");

  const [emailInputs, setEmailInputs] = useState([""]); // Initial state with one empty input
  const [pickedDate, setPickedDate] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();

  // Extract survey_id from route.params
  const survey_id = route.params?.survey_id || '';
  const addEmailInput = () => {
    setEmailInputs([...emailInputs, ""]); // Add a new empty input
  };

  const removeEmailInput = (index) => {
    const updatedEmails = [...emailInputs];
    updatedEmails.splice(index, 1); // Remove the input at the specified index
    setEmailInputs(updatedEmails);
  };

  const handleEmailChange = (text, index) => {
    const updatedEmails = [...emailInputs];
    updatedEmails[index] = text; // Update the email at the specified index
    setEmailInputs(updatedEmails);
  };
  function convertToISO8601(dateString) {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString;
  }
  const handleInvite = async () => {
   
  
      const authToken = await AsyncStorage.getItem('ngx-webstorage-authenticationToken');
      const accountApiResponse = await axios.get('http://10.0.2.2:8085/api/account',{
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const senderEmail = accountApiResponse.data.email;
      const formData = new FormData();
      const iso8601Date = convertToISO8601(pickedDate.toString());

    formData.append('data', JSON.stringify({
      "emails": emailInputs,
      "survey_id": survey_id,
      "validity": validity,
      "invitationCrons": [iso8601Date],
      "senderEmail": senderEmail,
      "getNotified": selectedId,
      "scoreNotif": 0,
      "timeZone": timeZone
    }));
    console.log(JSON.stringify({
        "emails": emailInputs,
        "survey_id": survey_id,
        "validity": validity,
        "invitationCrons": [iso8601Date],
        "senderEmail": senderEmail,
        "getNotified": selectedId,
        "scoreNotif": 0,
        "timeZone": timeZone
      }))
      // Send POST request to the API
      axios.post('http://10.0.2.2:8085/api/invitations', formData ,{
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log('invitation sent successfully:', response.data);
          // Navigate to the desired screen (e.g., ListStudies)
          navigation.navigate('ListSurvey');
        })
        .catch(error => console.error('Error adding study:', error));
  };
  const radioButtons = useMemo(
    () => [
      {
        id: "true", // acts as primary key, should be a unique and non-empty string
        label: "Yes",
        value: "true",
      },
      {
        id: "false",
        label: "No",
        value: "false",
      },
    ],
    []
  );
  const [selectedId, setSelectedId] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setPickedDate(date);
    hideDatePicker();
  };

  return (
    <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Email:</Text>

      {emailInputs.map((email, index) => (
        <View key={index} style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={(text) => handleEmailChange(text, index)}
            placeholder="Enter email"
            keyboardType="email-address"
            multiline
          />
          {index >= 1 && (
            <TouchableOpacity onPress={() => removeEmailInput(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addEmailInput}>
        <Text style={styles.addButton}>Add More</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Scheduling Option:</Text>
      <Text style={styles.sectionDescription}>
        Schedule and automate notifications to get the Patient answers Survey.
      </Text>
      <View style={styles.rowContainer}>
        <Text style={styles.sectionDescription}>Get notified if answered?</Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
          containerStyle={styles.radioGroupContainer}
          buttonContainerStyle={{ marginLeft: 10 }}
          buttonTextStyle={styles.radioButtonText}
        />
      </View>
      <Text style={styles.sectionTitle}>Select Time Zone:</Text>
      <SelectList
        data={[
          {value :"Africa/Abidjan"},                                 
          {value :"Africa/Algiers"},
          {value :"Africa/Bissau"},
          {value :"Africa/Cairo"},
          {value :"Africa/Casablanca"},
          {value :"Africa/Ceuta"},
          {value :"Africa/El_Aaiun"},
          {value :"Africa/Johannesburg"},
          {value :"Africa/Juba"},
          {value :"Africa/Khartoum"},
          {value :"Africa/Lagos"},
          {value :"Africa/Maputo"},
          {value :"Africa/Monrovia"},
          {value :"Africa/Nairobi"},
          {value :"Africa/Ndjamena"},
          {value :"Africa/Sao_Tome"},
          {value :"Africa/Tripoli"},
          {value :"Africa/Tunis"},
          {value :"Africa/Windhoek"},
          {value :"America/Adak"},
          {value :"America/Anchorage"},
          {value :"America/Araguaina"},
          {value :"America/Argentina/Buenos_Aires"},
          {value :"America/Argentina/Catamarca"},
          {value :"America/Argentina/Cordoba"},
          {value :"America/Argentina/Jujuy"},
          {value :"America/Argentina/La_Rioja"},
          {value :"America/Argentina/Mendoza"},
          {value :"America/Argentina/Rio_Gallegos"},
          {value :"America/Argentina/Salta"},
          {value :"America/Argentina/San_Juan"},
          {value :"America/Argentina/San_Luis"},
          {value :"America/Argentina/Tucuman"},
          {value :"America/Argentina/Ushuaia"},
          {value :"America/Asuncion"},
          {value :"America/Bahia"},
          {value :"America/Bahia_Banderas"},
          {value :"America/Barbados"},
          {value :"America/Belem"},
          {value :"America/Belize"},
          {value :"America/Boa_Vista"},
          {value :"America/Bogota"},
          {value :"America/Boise"},
          {value :"America/Cambridge_Bay"},
          {value :"America/Campo_Grande"},
          {value :"America/Cancun"},
          {value :"America/Caracas"},
          {value :"America/Cayenne"},
          {value :"America/Chicago"},
          {value :"America/Chihuahua"},
          {value :"America/Ciudad_Juarez"},
          {value :"America/Costa_Rica"},
          {value :"America/Cuiaba"},
          {value :"America/Danmarkshavn"},
          {value :"America/Dawson"},
          {value :"America/Dawson_Creek"},
          {value :"America/Denver"},
          {value :"America/Detroit"},
          {value :"America/Edmonton"},
          {value :"America/Eirunepe"},
          {value :"America/El_Salvador"},
          {value :"America/Fort_Nelson"},
          {value :"America/Fortaleza"},
          {value :"America/Glace_Bay"},
          {value :"America/Goose_Bay"},
          {value :"America/Grand_Turk"},
          {value :"America/Guatemala"},
          {value :"America/Guayaquil"},
          {value :"America/Guyana"},
          {value :"America/Halifax"},
          {value :"America/Havana"},
          {value :"America/Hermosillo"},
          {value :"America/Indiana/Indianapolis"},
          {value :"America/Indiana/Knox"},
          {value :"America/Indiana/Marengo"},
          {value :"America/Indiana/Petersburg"},
          {value :"America/Indiana/Tell_City"},
          {value :"America/Indiana/Vevay"},
          {value :"America/Indiana/Vincennes"},
          {value :"America/Indiana/Winamac"},
          {value :"America/Inuvik"},
          {value :"America/Iqaluit"},
          {value :"America/Jamaica"},
          {value :"America/Juneau"},
          {value :"America/Kentucky/Louisville"},
          {value :"America/Kentucky/Monticello"},
          {value :"America/La_Paz"},
          {value :"America/Lima"},
          {value :"America/Los_Angeles"},
          {value :"America/Maceio"},
          {value :"America/Managua"},
          {value :"America/Manaus"},
          {value :"America/Martinique"},
          {value :"America/Matamoros"},
          {value :"America/Mazatlan"},
          {value :"America/Menominee"},
          {value :"America/Merida"},
          {value :"America/Metlakatla"},
          {value :"America/Mexico_City"},
          {value :"America/Miquelon"},
          {value :"America/Moncton"},
          {value :"America/Monterrey"},
          {value :"America/Montevideo"},
          {value :"America/New_York"},
          {value :"America/Nome"},
          {value :"America/Noronha"},
          {value :"America/North_Dakota/Beulah"},
          {value :"America/North_Dakota/Center"},
          {value :"America/North_Dakota/New_Salem"},
          {value :"America/Nuuk"},
          {value :"America/Ojinaga"},
          {value :"America/Panama"},
          {value :"America/Paramaribo"},
          {value :"America/Phoenix"},
          {value :"America/Port-au-Prince"},
          {value :"America/Porto_Velho"},
          {value :"America/Puerto_Rico"},
          {value :"America/Punta_Arenas"},
          {value :"America/Rankin_Inlet"},
          {value :"America/Recife"},
          {value :"America/Regina"},
          {value :"America/Resolute"},
          {value :"America/Rio_Branco"},
          {value :"America/Santarem"},
          {value :"America/Santiago"},
          {value :"America/Santo_Domingo"},
          {value :"America/Sao_Paulo"},
          {value :"America/Scoresbysund"},
          {value :"America/Sitka"},
          {value :"America/St_Johns"},
          {value :"America/Swift_Current"},
          {value :"America/Tegucigalpa"},
          {value :"America/Thule"},
          {value :"America/Tijuana"},
          {value :"America/Toronto"},
          {value :"America/Vancouver"},
          {value :"America/Whitehorse"},
          {value :"America/Winnipeg"},
          {value :"America/Yakutat"},
          {value :"Antarctica/Casey"},
          {value :"Antarctica/Davis"},
          {value :"Antarctica/Macquarie"},
          {value :"Antarctica/Mawson"},
          {value :"Antarctica/Palmer"},
          {value :"Antarctica/Rothera"},
          {value :"Antarctica/Troll"},
          {value :"Asia/Almaty"},
          {value :"Asia/Amman"},
          {value :"Asia/Anadyr"},
          {value :"Asia/Aqtau"},
          {value :"Asia/Aqtobe"},
          {value :"Asia/Ashgabat"},
          {value :"Asia/Atyrau"},
          {value :"Asia/Baghdad"},
          {value :"Asia/Baku"},
          {value :"Asia/Bangkok"},
          {value :"Asia/Barnaul"},
          {value :"Asia/Beirut"},
          {value :"Asia/Bishkek"},
          {value :"Asia/Chita"},
          {value :"Asia/Choibalsan"},
          {value :"Asia/Colombo"},
          {value :"Asia/Damascus"},
          {value :"Asia/Dhaka"},
          {value :"Asia/Dili"},
          {value :"Asia/Dubai"},
          {value :"Asia/Dushanbe"},
          {value :"Asia/Famagusta"},
          {value :"Asia/Gaza"},
          {value :"Asia/Hebron"},
          {value :"Asia/Ho_Chi_Minh"},
          {value :"Asia/Hong_Kong"},
          {value :"Asia/Hovd"},
          {value :"Asia/Irkutsk"},
          {value :"Asia/Jakarta"},
          {value :"Asia/Jayapura"},
          {value :"Asia/Jerusalem"},
          {value :"Asia/Kabul"},
          {value :"Asia/Kamchatka"},
          {value :"Asia/Karachi"},
          {value :"Asia/Kathmandu"},
          {value :"Asia/Khandyga"},
          {value :"Asia/Kolkata"},
          {value :"Asia/Krasnoyarsk"},
          {value :"Asia/Kuching"},
          {value :"Asia/Macau"},
          {value :"Asia/Magadan"},
          {value :"Asia/Makassar"},
          {value :"Asia/Manila"},
          {value :"Asia/Nicosia"},
          {value :"Asia/Novokuznetsk"},
          {value :"Asia/Novosibirsk"},
          {value :"Asia/Omsk"},
          {value :"Asia/Oral"},
          {value :"Asia/Pontianak"},
          {value :"Asia/Pyongyang"},
          {value :"Asia/Qatar"},
          {value :"Asia/Qostanay"},
          {value :"Asia/Qyzylorda"},
          {value :"Asia/Riyadh"},
          {value :"Asia/Sakhalin"},
          {value :"Asia/Samarkand"},
          {value :"Asia/Seoul"},
          {value :"Asia/Shanghai"},
          {value :"Asia/Singapore"},
          {value :"Asia/Srednekolymsk"},
          {value :"Asia/Taipei"},
          {value :"Asia/Tashkent"},
          {value :"Asia/Tbilisi"},
          {value :"Asia/Tehran"},
          {value :"Asia/Thimphu"},
          {value :"Asia/Tokyo"},
          {value :"Asia/Tomsk"},
          {value :"Asia/Ulaanbaatar"},
          {value :"Asia/Urumqi"},
          {value :"Asia/Ust-Nera"},
          {value :"Asia/Vladivostok"},
          {value :"Asia/Yakutsk"},
          {value :"Asia/Yangon"},
          {value :"Asia/Yekaterinburg"},
          {value :"Asia/Yerevan"},
          {value :"Atlantic/Azores"},
          {value :"Atlantic/Bermuda"},
          {value :"Atlantic/Canary"},
          {value :"Atlantic/Cape_Verde"},
          {value :"Atlantic/Faroe"},
          {value :"Atlantic/Madeira"},
          {value :"Atlantic/South_Georgia"},
          {value :"Atlantic/Stanley"},
          {value :"Australia/Adelaide"},
          {value :"Australia/Brisbane"},
          {value :"Australia/Broken_Hill"},
          {value :"Australia/Darwin"},
          {value :"Australia/Eucla"},
          {value :"Australia/Hobart"},
          {value :"Australia/Lindeman"},
          {value :"Australia/Lord_Howe"},
          {value :"Australia/Melbourne"},
          {value :"Australia/Perth"},
          {value :"Australia/Sydney"},
          {value :"CET"},
          {value :"CST6CDT"},
          {value :"EET"},
          {value :"EST"},
          {value :"EST5EDT"},
          {value :"Etc/GMT"},
          {value :"Etc/GMT+1"},
          {value :"Etc/GMT+10"},
          {value :"Etc/GMT+11"},
          {value :"Etc/GMT+12"},
          {value :"Etc/GMT+2"},
          {value :"Etc/GMT+3"},
          {value :"Etc/GMT+4"},
          {value :"Etc/GMT+5"},
          {value :"Etc/GMT+6"},
          {value :"Etc/GMT+7"},
          {value :"Etc/GMT+8"},
          {value :"Etc/GMT+9"},
          {value :"Etc/GMT-1"},
          {value :"Etc/GMT-10"},
          {value :"Etc/GMT-11"},
          {value :"Etc/GMT-12"},
          {value :"Etc/GMT-13"},
          {value :"Etc/GMT-14"},
          {value :"Etc/GMT-2"},
          {value :"Etc/GMT-3"},
          {value :"Etc/GMT-4"},
          {value :"Etc/GMT-5"},
          {value :"Etc/GMT-6"},
          {value :"Etc/GMT-7"},
          {value :"Etc/GMT-8"},
          {value :"Etc/GMT-9"},
          {value :"Etc/UTC"},
          {value :"Europe/Andorra"},
          {value :"Europe/Astrakhan"},
          {value :"Europe/Athens"},
          {value :"Europe/Belgrade"},
          {value :"Europe/Berlin"},
          {value :"Europe/Brussels"},
          {value :"Europe/Bucharest"},
          {value :"Europe/Budapest"},
          {value :"Europe/Chisinau"},
          {value :"Europe/Dublin"},
          {value :"Europe/Gibraltar"},
          {value :"Europe/Helsinki"},
          {value :"Europe/Istanbul"},
          {value :"Europe/Kaliningrad"},
          {value :"Europe/Kirov"},
          {value :"Europe/Kyiv"},
          {value :"Europe/Lisbon"},
          {value :"Europe/London"},
          {value :"Europe/Madrid"},
          {value :"Europe/Malta"},
          {value :"Europe/Minsk"},
          {value :"Europe/Moscow"},
          {value :"Europe/Paris"},
          {value :"Europe/Prague"},
          {value :"Europe/Riga"},
          {value :"Europe/Rome"},
          {value :"Europe/Samara"},
          {value :"Europe/Saratov"},
          {value :"Europe/Simferopol"},
          {value :"Europe/Sofia"},
          {value :"Europe/Tallinn"},
          {value :"Europe/Tirane"},
          {value :"Europe/Ulyanovsk"},
          {value :"Europe/Vienna"},
          {value :"Europe/Vilnius"},
          {value :"Europe/Volgograd"},
          {value :"Europe/Warsaw"},
          {value :"Europe/Zurich"},
          {value :"HST"},
          {value :"Indian/Chagos"},
          {value :"Indian/Maldives"},
          {value :"Indian/Mauritius"},
          {value :"MET"},
          {value :"MST"},
          {value :"MST7MDT"},
          {value :"PST8PDT"},
          {value :"Pacific/Apia"},
          {value :"Pacific/Auckland"},
          {value :"Pacific/Bougainville"},
          {value :"Pacific/Chatham"},
          {value :"Pacific/Easter"},
          {value :"Pacific/Efate"},
          {value :"Pacific/Fakaofo"},
          {value :"Pacific/Fiji"},
          {value :"Pacific/Galapagos"},
          {value :"Pacific/Gambier"},
          {value :"Pacific/Guadalcanal"},
          {value :"Pacific/Guam"},
          {value :"Pacific/Honolulu"},
          {value :"Pacific/Kanton"},
          {value :"Pacific/Kiritimati"},
          {value :"Pacific/Kosrae"},
          {value :"Pacific/Kwajalein"},
          {value :"Pacific/Marquesas"},
          {value :"Pacific/Nauru"},
          {value :"Pacific/Niue"},
          {value :"Pacific/Norfolk"},
          {value :"Pacific/Noumea"},
          {value :"Pacific/Pago_Pago"},
          {value :"Pacific/Palau"},
          {value :"Pacific/Pitcairn"},
          {value :"Pacific/Port_Moresby"},
          {value :"Pacific/Rarotonga"},
          {value :"Pacific/Tahiti"},
          {value :"Pacific/Tarawa"},
          {value :"Pacific/Tongatapu"},
          {value :"WET"}
        ]}
        setSelected={(val) => setTimeZone(val)}
        save="value"
      />
      <Text style={styles.sectionTitle}>Select Validity:</Text>
      <SelectList
        data={[
          { value: "Two Hours", key: "2h" },
          { value: "Half Day", key: "12h" },
          { value: "One Day", key: "1d" },
          { value: "Two Days", key: "2d" },
          { value: "One Week", key: "1w" },
          { value: "One Month", key: "1M" },
          { value: "Always", key: "always" },
        ]}
        save="value"
        setSelected={(val) => setValidity(val)}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={styles.sectionTitle}>Selected Dates and Times:</Text>

      <TouchableOpacity onPress={showDatePicker}>
        <View style={styles.textInputContainer}>
          <TextInput
            editable={false}
            placeholder="Select Date"
            value={pickedDate ? pickedDate.toString() : ""}
            style={styles.textInput}
          />
        </View>
      </TouchableOpacity>

      <Button title="Invite" onPress={handleInvite} />
    </ScrollView>
  );
};

export default InviteSurveys;
