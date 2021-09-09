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

const ApiUrl = () => {
  const [apiUrl, updateApiUrl] = React.useState('http://');
  const [apiEndpoint, updateApiEndpoint] = React.useState('');


  async function saveStorageItem(key: string, value: string) {
    await EncryptedStorage.setItem(key, value);
  }
//http://ipsave.levitruelove.com?name=home&list=true
  const testAPIIP = async () => {
    try {
      const response = await fetch(apiUrl);
      if(response.status === 200){
        updateApiEndpoint(await response.text());
      }else{
        throw new Error('Could not fetch the API domain');
      }
    } catch (error) {
      Alert.alert(error + '');
      console.error(error);
    } finally {
      console.log(apiEndpoint);
      saveStorageItem('apiEndpoint', apiEndpoint);
    }
  }
  return (
    <SafeAreaView>
      <Text
      style={styles.textBody}>Please enter the URL that provides the API location</Text>
      <TextInput 
      style={styles.textInput}
      onChangeText={updateApiUrl}
      value={apiUrl}></TextInput>
      <Pressable
      style={styles.button}
      onPress={ () => testAPIIP()}>
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

export default ApiUrl;