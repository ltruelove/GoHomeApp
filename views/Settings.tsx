
import React from 'react';
import {
    Pressable,
    Text,
    SafeAreaView,
    View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../AppStyles'
import ApiUrl from '../views/ApiUrl'
import PinCode from './PinCode'
import Globals from '../Globals';

interface Properties {
    updateView: Function
}

const Settings = (props: Properties) => {
  const [showPin, updateShowPin] = React.useState(false);
  const [apiEndpoint, updateEndpointUrl] = React.useState('');

  const clearSettings = () => {
      EncryptedStorage.clear().then(() => {
          updateShowPin(false);
      });
  }

  const renderFields = () => {
      if(showPin){
        return <PinCode updateView={props.updateView} apiEndpoint={apiEndpoint}></PinCode>
      }else{
        return <ApiUrl updateShow={updateShowPin}></ApiUrl>
      }
  }

  React.useEffect(() => {
      EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME).then((result) => {
          if(result){
              updateEndpointUrl(result);
              updateShowPin(true);
          }else{
              updateShowPin(false);
          }
      });
  })

  return (
    <SafeAreaView style={styles.content}>
            <Text style={styles.textHeader}>Settings</Text>

            { renderFields() }
        <Pressable style={styles.iconButtonContainer}
            onPress={clearSettings}  >
            <Text style={styles.textButton}>Clear Settings</Text>
        </Pressable>
    </SafeAreaView>
  );
}

export default Settings;