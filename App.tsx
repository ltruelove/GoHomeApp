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
import styles from './AppStyles';
import EncryptedStorage from 'react-native-encrypted-storage';
import Globals from './Globals';

const App = () => {
  const [selectedScreen, updateSelectedScreen] = React.useState('Settings');
  const [firstLoad, updateFirstLoad] = React.useState(true);
  const [loading, updateLoading] = React.useState(true);

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
        console.log('test URL: ' + url);
        if(response.status === 200){
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
    console.log('fail');
        updateLoading(false);
        console.log(error)
      });
    } catch (error) {
    console.log('fail2');
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
                console.log('home?');
                updateSelectedScreen('Home');
                updateFirstLoad(false);
              }
            })
          }
          updateLoading(false);
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
    </SafeAreaView>
  );
};

export default App;
