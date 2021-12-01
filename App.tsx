import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  Alert
} from 'react-native';

import ApiPinScreen from './containers/ApiPinScreen';
import ApiUrlScreen from './containers/ApiUrlScreen';
import Home from './containers/Home';
import Garage from './containers/Garage';
import Rooms from './containers/Rooms';
import EncryptedStorage from 'react-native-encrypted-storage';
import Globals from './Globals';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {
  //Default to 'Settings' view
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

  const fetchAPIURL = async (url: string) => {
    try {
      let response = await fetch(url);

      if(!response.ok){
        updateSelectedScreen('Settings');
        updateLoading(false);
        throw new Error('Did not get a successful response from the API Service');
      }else{
        let responseText = await response.text();
        EncryptedStorage.getItem(Globals.API_ENDPOINT_PORT, (port) => {
          if(port !== null){
            responseText += ':' + port;
          }

          testUrl('http://' + responseText);
        });
      }
    } catch (error) {
      updateLoading(false);
      console.log(error);
    }

  }

  const testUrl = async (url: string) => {
    try {
      let response = await fetch(url);

      if(response.ok){
        updateApiUrl(url);
        //this is really only necessary when using an endpoint service
        EncryptedStorage.setItem(Globals.API_ENDPOINT_NAME, url);
        let pin = await EncryptedStorage.getItem(Globals.API_PIN_CODE_NAME);
        console.log('App PIN: ' + pin);
        if(pin){
          checkPIN(pin, url)
        }else{
          updateSelectedScreen('Settings');
          throw new Error('Please enter a valid PIN');
        }
      }else{
        updateSelectedScreen('Settings');
        updateLoading(false);
        throw new Error('Did not get a successful response from the API');
      }
    } catch (error) {
      updateLoading(false);
      console.log(error);
    }

  }

  const checkPIN = async (pin: string, url: string) => {
    try {
      const postBody = JSON.stringify({ 'pinCode': pin })
      let response = await fetch(url + '/pinValid', {
          method: 'POST',
          body: postBody
      });

      if(response.ok){
        Alert.alert("There was an error validating the PIN");
        EncryptedStorage.removeItem(Globals.API_PIN_CODE_NAME);
        updateSelectedScreen('Settings');
        updateLoading(false);
        return;
      }else{
        updateApiPIN(pin);
        let responseData = await response.json();
        if(!responseData.IsValid){
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
      }
    } catch (error) {
        updateLoading(false);
        console.error(error);
    }
}

  React.useEffect(() => {
    //check to see if we're using a service that supplies us with the endpoint url
    async function TestApiStatus(){
      let isUsingService = await EncryptedStorage.getItem(Globals.API_USING_ENDPOINT_SERVICE);

      if(isUsingService !== 'true'){
        //test the endpoint value directly
        let result = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);
        if(result){
          testUrl(result);
        }else{
          updateLoading(false);
        }
      }else{
        //fetch the endpoint value from the provider
        let result = await EncryptedStorage.getItem(Globals.API_ENDPOINT_SERVICE_URL);
        if(result){
          fetchAPIURL(result);
        }else{
          updateLoading(false);
        }
      }
    }

    TestApiStatus();
  })

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="API Settings" component={ApiUrlScreen} />
        <Stack.Screen name="API PIN" component={ApiPinScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Garage" component={Garage} />
        <Stack.Screen name="Rooms" component={Rooms} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
