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
import styles from '../AppStyles'
import Globals from '../Globals'

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

    const validateExistingPIN = async () => {
        try {
            let pinString = await EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME);
            if(!pinString){
                updatePinValid(false);
                return;
            }

            console.log(pinString);
            let apiEndpoint = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
                const postBody = JSON.stringify({ 'pinCode': pinString })

            let response = await fetch(apiEndpoint + '/pinValid', {
                method: 'POST',
                body: postBody
            });
            
            if(!response.ok){
                updatePinValid(false);
                Alert.alert("There was an error validating the PIN");
                await EncryptedStorage.removeItem('apiPIN');
                return;
            }else{
                let data = await response.json();
                if(data){
                    await EncryptedStorage.setItem('apiPIN', pinString);
                    updatePinValid(true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const checkPIN = async () => {
        try {
            let apiEndpoint = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
            const pinString = number;
            const postBody = JSON.stringify({ 'pinCode': pinString })

            let response = await fetch(apiEndpoint + '/pinValid', {
                method: 'POST',
                body: postBody
            });

            if(!response.ok){
                updatePinValid(false);
                Alert.alert("There was an error validating the PIN");
                EncryptedStorage.removeItem('apiPIN');
                return;
            }else{
                let data = await response.json();
                if(data){
                    Alert.alert("PIN Valid!");
                    await EncryptedStorage.setItem(Globals.API_PIN_CODE_NAME, pinString);
                    updatePinValid(true);
                    goHome();
                }
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