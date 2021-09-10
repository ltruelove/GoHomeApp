import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  TextInput,
  Alert,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
import styles from './AppStyles'
import Globals from './Globals'

interface Properties {
    updateView: Function
    apiEndpoint: string
}

const PinCode = (props: Properties) => {
    const [number, updateNumber] = React.useState('');
    const [pinValid, updatePinValid] = React.useState(false);

    const navigateHome = () => {
        console.log("home test");
        props.updateView('Home');
    }

    const validateExistingPIN = async () => {
        try {
            EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME).then( (pinString) => {
                if(!pinString){
                    updatePinValid(false);
                    return;
                }

                const postBody = JSON.stringify({ 'pinCode': pinString })

                fetch(props.apiEndpoint + '/pinValid', {
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
        } catch (error) {
            console.error(error);
        }
    }

    const checkPIN = async () => {
        try {
            const pinString = number;
            const postBody = JSON.stringify({ 'pinCode': pinString })

            fetch(props.apiEndpoint + '/pinValid', {
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
                console.error('*****Error***:', error);
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
      <Text
      style={styles.textBody}>Please enter the PIN for your API</Text>

      <TextInput 
      style={styles.textInput}
      onChangeText={updateNumber}
      value={number}
      placeholder="PIN"
      keyboardType="numeric"></TextInput>

      <Pressable
      style={styles.button}
      onPress={ () => checkPIN()}>
        <Text style={styles.textButton}>Validate PIN</Text>
      </Pressable>

      {pinValid ? 
        <Pressable
            style={styles.button}
            onPress={navigateHome}>
                <Text style={styles.textButton}>Home</Text>
            </Pressable>
       : null}

    </SafeAreaView>
  );
}

export default PinCode;