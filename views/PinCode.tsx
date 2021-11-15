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

interface Properties {
    updateView: Function
    apiEndpoint: string
}

const PinCode = (props: Properties) => {
    const [number, updateNumber] = React.useState('');
    const [pinValid, updatePinValid] = React.useState(false);

    const navigateHome = () => {
        props.updateView('Home');
    }

    const validateExistingPIN = async () => {
        try {
            EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME).then( (pinString) => {
                if(!pinString){
                    updatePinValid(false);
                    return;
                }

                EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME).then( (apiEndpoint) => {
                    const postBody = JSON.stringify({ 'pinCode': pinString })

                    fetch(apiEndpoint + '/pinValid', {
                        method: 'POST',
                        body: postBody
                    })
                    .then(response => {
                        if(response.status !== 200){
                            updatePinValid(false);
                            Alert.alert("There was an error validating the PIN");
                            EncryptedStorage.removeItem('apiPIN');
                            return;
                        }else{
                            response.json().then((data) => {
                                if(data){
                                    EncryptedStorage.setItem('apiPIN', pinString);
                                    updatePinValid(true);
                                }
                            })
                        }
                    })
                    .catch((error) => {
                        console.error('*Error:', error);
                    });
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    const checkPIN = async () => {
        try {
            EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME).then( (apiEndpoint) => {
                const pinString = number;
                const postBody = JSON.stringify({ 'pinCode': pinString })

                fetch(apiEndpoint + '/pinValid', {
                    method: 'POST',
                    body: postBody
                })
                .then(response => {
                    if(response.status !== 200){
                        updatePinValid(false);
                        Alert.alert("There was an error validating the PIN");
                        EncryptedStorage.removeItem('apiPIN');
                        return;
                    }else{
                        response.json().then((data) => {
                            if(data){
                                Alert.alert("PIN Valid!");
                                EncryptedStorage.setItem('apiPIN', pinString);
                                updatePinValid(true);
                            }
                        })
                    }
                })
                .catch((error) => {
                    console.error('*****Error***:', error);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        validateExistingPIN();
    })

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

        {pinValid ? 
        <Pressable
            style={styles.iconButtonContainer}
            onPress={navigateHome}>
                <Text style={styles.textButton}>Home</Text>
            </Pressable>
        : null}
    </SafeAreaView>
  );
}

export default PinCode;