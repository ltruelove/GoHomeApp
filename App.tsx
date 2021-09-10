import React from 'react';
import {
  SafeAreaView,
  Alert,
  Text,
  View,
  Pressable
} from 'react-native';

import Settings from './Settings';
import Home from './Home';
import Garage from './Garage';
import Rooms from './Rooms';
import styles from './AppStyles';
import EncryptedStorage from 'react-native-encrypted-storage';
import Globals from './Globals';

const App = () => {
  const [selectedScreen, updateSelectedScreen] = React.useState('Settings');
  const [firstLoad, updateFirstLoad] = React.useState(true);
  const [loading, updateLoading] = React.useState(true);
  const [apiUrl, updateApiUrl] = React.useState('');
  const [apiPIN, updateApiPIN] = React.useState('');

  const clearSettings = () => {
    EncryptedStorage.clear().then(() => {
      updateSelectedScreen('Settings');
      updateFirstLoad(false);
      updateLoading(false);
    });
  }

  const testUrl = async (url: string) => {
    try {
      fetch(url).then((response) => {
        if(response.status === 200){
          updateApiUrl(url);
          EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME).then((pin) => {
            if(pin){
              checkPIN(pin, url)
            }else{
              updateSelectedScreen('Settings');
              throw new Error('Please enter a valid PIN');
            }
          })
        }else{
            updateSelectedScreen('Settings');
            updateLoading(false);
            throw new Error('Did not get a successful response from the API');
        }

      }).catch((error) => {
        updateLoading(false);
        console.log(error)
      });
    } catch (error) {
      updateLoading(false);
      console.log(error);
    }

  }

  const checkPIN = async (pin: string, url: string) => {
    try {
      const postBody = JSON.stringify({ 'pinCode': pin })
      fetch(url + '/pinValid', {
          method: 'POST',
          body: postBody
      })
      .then(response => {
          if(response.status !== 200){
            Alert.alert("There was an error validating the PIN");
            EncryptedStorage.removeItem(Globals.API_PIN_CODE_NAME);
            updateSelectedScreen('Settings');
            updateLoading(false);
            return;
          }else{
            updateApiPIN(pin);
            response.json().then((data) => {
              if(!data.IsValid){
                Alert.alert("There was an error validating the PIN");
                EncryptedStorage.removeItem(Globals.API_PIN_CODE_NAME);
                updateSelectedScreen('Settings');
                updateLoading(false);
                return;
              }

              if(firstLoad){
                //PIN is valid, go to home screen
                updateSelectedScreen('Home');
                updateFirstLoad(false);
              }

              updateLoading(false);
            })
          }
      })
      .catch((error) => {
          updateLoading(false);
          console.error('*****Error:', error);
      });
    } catch (error) {
        updateLoading(false);
        console.error(error);
    }
}

  React.useEffect(() => {
    EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME).then((result) => {
      if(result){
        testUrl(result);
      }else{
        updateLoading(false);
      }
    });
  })

  return (
    loading ?
    <View>
      <Text style={styles.textBody}>Loading</Text>
      <Pressable style={styles.button} onPress={clearSettings}  >
              <Text style={styles.textButton}>Clear Settings</Text>
      </Pressable>
    </View>
    :
    <SafeAreaView style={styles.main}>
        <Text style={styles.textBody}>{selectedScreen}</Text>
        { selectedScreen === 'Settings' ?
          <Settings updateView={updateSelectedScreen}></Settings>
        : null }
        { selectedScreen === 'Home' ?
          <Home updateView={updateSelectedScreen}></Home>
        : null }
        { selectedScreen === 'Garage' ?
          <Garage updateView={updateSelectedScreen} apiEndpoint={apiUrl} apiPIN={apiPIN}></Garage>
        : null }
        { selectedScreen === 'Rooms' ?
          <Rooms updateView={updateSelectedScreen} apiEndpoint={apiUrl} apiPIN={apiPIN}></Rooms>
        : null }
    </SafeAreaView>
  );
};

export default App;
