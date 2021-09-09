import React from 'react';
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

const getStorageVal = async (key: string) => {
    let val = await EncryptedStorage.getItem('apiEndpoint');
    return val;
} 

const PinCode = () => {
    const [number, updateNumber] = React.useState('');

    const checkPIN = async () => {
    try {
        getStorageVal('apiEndpoint').then((apiEndpoint) =>{
            const apiURL = 'http://' + apiEndpoint + ':8181';
            const pinString = number;
            const postBody = JSON.stringify({ "pinCode" :pinString })

            fetch(apiURL + '/pinValid', {
                method: 'POST',
                body: postBody
            })
            .then(response => {
                if(response.status !== 200){
                    Alert.alert("There was an error validating the PIN");
                    EncryptedStorage.removeItem('apiPIN');
                    return;
                }else{
                    return response.json()
                }
            })
            .then(data => {
                if(data){
                    EncryptedStorage.setItem('apiPIN', pinString);
                }
            })
            .catch((error) => {
                console.error('*****Error:', error);
            });

        });
    } catch (error) {
        console.error(error);
    }
  }
  return (
    <SafeAreaView>
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
        <Text style={styles.textButton}>Submit</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 12,
    backgroundColor: "#00F",
    padding: 10
  },
  textButton: {
    color: '#FFF',
    fontSize: 14
  },
  textBody: {
    color: '#FFF',
    fontSize: 14,
  },
  textInput: {
    color: '#333',
    backgroundColor: '#FFF',
    width: '100%'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default PinCode;