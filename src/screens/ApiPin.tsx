import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  TextInput,
  Alert,
  View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../constants/AppStyles'
import Globals from '../constants/Globals'
import { IsPinValid } from '../services/GoHomeAPI';

const ApiPinScreen = ({ navigation }) => {
    const [number, updateNumber] = React.useState('');
    const [pinValid, updatePinValid] = React.useState(false);

    const goHome = () => {
        navigation.navigate('Home');
    }

    const clearSettings = async () => {
        await EncryptedStorage.clear();
        navigation.navigate("API Settings");
    }

    const checkPINWithValues = async (apiEndpoint: string, apiPinToValidate: string) => {
        let apiPinValid = await IsPinValid(apiEndpoint, apiPinToValidate);
        
        updatePinValid(apiPinValid);
        if(!apiPinValid){
            Alert.alert("There was an error validating the PIN");
            await EncryptedStorage.removeItem('apiPIN');
            return;
        }

        await EncryptedStorage.setItem('apiPIN', apiPinToValidate);
        console.log('testing');
        return true;
    }

    const validateExistingPIN = async () => {
        try {
            let pinString = await EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME);
            if(!pinString){
                updatePinValid(false);
                return;
            }

            let apiEndpoint = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
            if(!apiEndpoint){
                throw new Error("The API endpoint is invalid");
            }
            await checkPINWithValues(apiEndpoint, pinString);
        } catch (error) {
            console.error(error);
        }
    }

    const checkPIN = async () => {
        try {
            let apiEndpoint = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
            if(!apiEndpoint){
                throw new Error("The API endpoint is invalid");
            }
            const pinString = number;
            let apiPinValid = await checkPINWithValues(apiEndpoint, pinString);

            console.log(pinString);
            console.log(apiPinValid);
            if(apiPinValid){
                goHome();
            }
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        validateExistingPIN();
    }, [])

  return (
    <SafeAreaView style={styles.content}>
        <View style={styles.leftContent}>
            <Text style={styles.textBody}>Please enter the PIN for your API</Text>

            <TextInput 
            style={styles.textInput}
            onChangeText={updateNumber}
            value={number}
            secureTextEntry={true}
            placeholder="PIN"
            keyboardType="numeric"></TextInput>
        </View>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => checkPIN()}>
            <Text style={styles.textButton}>Validate PIN</Text>
        </Pressable>

        <Pressable style={styles.iconButtonContainer}
            onPress={clearSettings}  >
            <Text style={styles.textButton}>Clear Settings</Text>
        </Pressable>

        {pinValid ? 
        <Pressable
            style={styles.iconButtonContainer}
            onPress={goHome}>
                <Text style={styles.textButton}>Home</Text>
            </Pressable>
        : null}
    </SafeAreaView>
  );
}

export default ApiPinScreen;