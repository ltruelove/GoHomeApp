import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  TextInput,
  Alert,
  Switch,
  View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../constants/AppStyles'
import Globals from '../constants/Globals'
import {GetApiUrlFromService, testApiUrl} from '../services/GoHomeAPI';

const ApiUrlScreen = ({ navigation }) => {
    const [apiUrl, updateApiUrl] = React.useState('http://');
    const [apiEndpointPort, updateApiEndpointPort] = React.useState('');
    const [enterManually, updateEnterManually] = React.useState(false);
    const [showHomeButton, updateShowHomeButton] = React.useState(false);

    function saveStorageItem(key: string, value: string) {
        EncryptedStorage.setItem(key, value);
    }

    const goHome = () => {
        navigation.navigate('Home');
    }

    const goPin = () => {
        navigation.navigate('API PIN');
    }

    const testAPIIP = async (url: string) => {
        try {
            let responseText = await GetApiUrlFromService(url);
            let fullUrl = 'http://' + responseText;
            if(apiEndpointPort){
                fullUrl += ':' + apiEndpointPort;
            }

            saveStorageItem(Globals.API_ENDPOINT_NAME, fullUrl);
            saveStorageItem(Globals.API_ENDPOINT_SERVICE_URL, url);
            saveStorageItem(Globals.API_ENDPOINT_PORT, apiEndpointPort);
            updateShowHomeButton(true);
            goPin();
        } catch (error) {
            Alert.alert(error + '');
        }
    }

    const testKnownIP  = async (url: string) => {
        try {
            const isValid = await testApiUrl(url);
            if(!isValid){
                throw new Error('Did not get a successful response from the API');
            }

            saveStorageItem(Globals.API_ENDPOINT_NAME, url);
            updateShowHomeButton(true);
        } catch (error) {
            Alert.alert(error + '');
            console.error(error);
        }
    }

    const ipTest = () => {
        if(!apiUrl){
            console.log('no url given');
            return;
        }

        let fullUrl = apiUrl;
        if(apiEndpointPort){
            fullUrl += ':' + apiEndpointPort;
        }

        // if the user knows their api endpoint
        if(enterManually){
            testKnownIP(fullUrl);
        }else{
            //if the API endpoint is provided by another url
            testAPIIP(apiUrl);
        }
    }

    const manuallEnterChange = (val: boolean) => {
        updateEnterManually(val);
        EncryptedStorage.setItem(Globals.API_USING_ENDPOINT_SERVICE, val ? 'false' : 'true');
    }

    React.useEffect(() => {
        async function TestApiStatus(){
            let showHome = false;
            let endpointResult = await EncryptedStorage.getItem(Globals.API_USING_ENDPOINT_SERVICE);
            let endpointPort = await EncryptedStorage.getItem(Globals.API_ENDPOINT_PORT);
            let endpointPin = await EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME);

            if(endpointPort){
                updateApiEndpointPort(endpointPort);
            }

            if(endpointResult === 'true'){
                let endpointService = await EncryptedStorage.getItem(Globals.API_ENDPOINT_SERVICE_URL);
                if(endpointService){
                    updateApiUrl(endpointService);
                    showHome = true;

                    if(endpointPin){
                        goHome();
                    }else{
                        goPin();
                    }
                }

                updateEnterManually(false);
            }else{
                let result = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
                if(result){
                    showHome = true;
                    navigation.navigate("API PIN");
                }

                updateEnterManually(true);
            }

            updateShowHomeButton(showHome);


            if(!endpointResult){
                EncryptedStorage.setItem(Globals.API_USING_ENDPOINT_SERVICE, 'true');
            }
        }

        TestApiStatus();
    }, [])

  return (
    <SafeAreaView style={styles.content}>
        <View style={styles.leftContent}>
            <Text
                style={styles.textBody}>
                    Please enter the URL that provides the API location.</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={updateApiUrl}
                value={apiUrl}></TextInput>
            <Text
                style={styles.textBody}>Endpoint port, if any.</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={updateApiEndpointPort}
                value={apiEndpointPort}
                keyboardType="numeric"></TextInput>
            <Text style={styles.textBody}>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={enterManually ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={manuallEnterChange}
                value={enterManually} 
                style={styles.switch} /> The URL given is the endpoint.</Text>
        </View>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => ipTest()}>
            <Text style={styles.textButton}>Fetch API Endpoint</Text>
        </Pressable>

        {showHomeButton? 
        <View>
            <Pressable
                style={styles.iconButtonContainer}
                onPress={ () => goHome()}>
                <Text style={styles.textButton}>Home</Text>
            </Pressable>
            <Pressable
                style={styles.iconButtonContainer}
                onPress={ () => goPin()}>
                <Text style={styles.textButton}>API PIN</Text>
            </Pressable>
        </View>
        : null }
    </SafeAreaView>
  );
}

export default ApiUrlScreen;