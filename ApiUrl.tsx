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
import styles from './AppStyles'
import Globals from './Globals'

interface Properties {
    updateShow: Function
}

const ApiUrl = (props: Properties) => {
    const [apiUrl, updateApiUrl] = React.useState('http://');
    const [apiEndpointPort, updateApiEndpointPort] = React.useState('');
    const [enterManually, updateEnterManually] = React.useState(false);


    async function saveStorageItem(key: string, value: string) {
        await EncryptedStorage.setItem(key, value);
    }

    const testAPIIP = async (url: string) => {
        let responseText = '';
        try {
            const response = await fetch(url);
            if(response.status === 200){
                responseText = await response.text();
            }else{
                throw new Error('Could not fetch the API domain');
            }
        } catch (error) {
            Alert.alert(error + '');
            console.error(error);
            props.updateShow(false);
        } finally {
            let fullUrl = 'http://' + responseText;
            if(apiEndpointPort){
                fullUrl += ':' + apiEndpointPort;
            }
            saveStorageItem(Globals.API_ENDPOINT_NAME, fullUrl);
            saveStorageItem(Globals.API_ENDPOINT_SERVICE_URL, url);
            saveStorageItem(Globals.API_ENDPOINT_PORT, apiEndpointPort);
            props.updateShow(true);
        }
    }

    const testKnownIP  = async (url: string) => {
        try {
            const response = await fetch(url);
            if(response.status !== 200){
                throw new Error('Did not get a successful response from the API');
            }
        } catch (error) {
            Alert.alert(error + '');
            console.error(error);
            props.updateShow(false);
        } finally {
            console.log(url);
            saveStorageItem(Globals.API_ENDPOINT_NAME, url);
            props.updateShow(true);
        }
    }

    const ipTest = () => {
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
        console.log(val);
        updateEnterManually(val);
        EncryptedStorage.setItem(Globals.API_USING_ENDPOINT_SERVICE, val ? 'false' : 'true');
    }

    React.useEffect(() => {
        EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME).then((result) => {
            if(result){
                props.updateShow(true);
            }
        });

        EncryptedStorage.getItem(Globals.API_USING_ENDPOINT_SERVICE).then((result) => {
            if(result){
                updateEnterManually(result !== 'true');
            }else{
                updateEnterManually(false);
                EncryptedStorage.setItem(Globals.API_USING_ENDPOINT_SERVICE, 'true');
            }
        });
    })

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
    </SafeAreaView>
  );
}

export default ApiUrl;