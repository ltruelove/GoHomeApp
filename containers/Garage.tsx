import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  Alert,
  View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../AppStyles'
import Globals from '../Globals'

const Garage = ({ navigation }) => {
    const [doorStatus, updateDoorStatus] = React.useState('unknown');
    const [humidity, updateHumidity] = React.useState('');
    const [fahrenheit, updateFahrenheit] = React.useState('');
    const [celcius, updateCelcius] = React.useState('');
    const [pinCode, updatePinCode] = React.useState(''); 
    const [apiEndpoint, updateApiEndPoint] = React.useState(''); 

    const goBackHome = () => {
        navigation.navigate('Home');
    }

    const clickGarageDoorButton = async () => {
        try {
            const postBody = JSON.stringify({ "pinCode" :pinCode })

            let response = await fetch(apiEndpoint + '/clickGarageDoorButton', {
                method: 'POST',
                body: postBody
            });

            if(!response.ok){
                Alert.alert("There was an error clicking the garage door button");
                return;
            }else {
                let data = await response.json();
                if(!data.IsValid){
                    Alert.alert("Button was not clicked successfully!");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const clearGarageData = () => {
        updateHumidity('');
        updateFahrenheit('');
        updateCelcius('');
        updateDoorStatus('unknown');
    }

    const fetchGarageStatus = async () => {
        clearGarageData();
        let url = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
        try {
            let response = await fetch(url + '/doorStatus');
            if(!response.ok){
                Alert.alert("There was an error fetching the garage status");
                return;
            }else{
                let data = await response.json();
                if(data){
                    updateHumidity(data.humidity);
                    updateFahrenheit(data.fahrenheit);
                    updateCelcius(data.celcius);
                    updateDoorStatus(data.doorClosed === 1 ? "No" : "Yes");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        async function GetApiValues(){
            let pin = await EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME);
            let url = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);

            if(pin && url){
                await updatePinCode(pin);
                await updateApiEndPoint(url);
            }else{
                navigation.navigate('Home');
            }
            
            setTimeout(() => {
                fetchGarageStatus();
            }, 1000);
        }

        GetApiValues();
    }, [])

  return (
    <SafeAreaView style={styles.content}>
        <View style={styles.leftContent}>
            <View style={styles.leftContentIndent}>
                <Text style={styles.textHeader}>Garage Status</Text>
                <Text style={styles.textBody}>Door open: {doorStatus}</Text>
                <Text style={styles.textBody}>Fahrenheit: {fahrenheit}</Text>
                <Text style={styles.textBody}>Celcius: {celcius}</Text>
                <Text style={styles.textBody}>Humidity: {humidity}%</Text>
            </View>
        </View>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => clickGarageDoorButton()}>
            <Text style={styles.textButton}>Click Garage Door Button</Text>
        </Pressable>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => fetchGarageStatus()}>
            <Text style={styles.textButton}>Refresh Data</Text>
        </Pressable>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => goBackHome()}>
            <Text style={styles.textButton}>Home</Text>
        </Pressable>
    </SafeAreaView>
  );
}

export default Garage;