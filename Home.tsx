import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableHighlight
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import styles from './AppStyles'
import Globals from './Globals'

interface Properties {
    updateView: Function
}

const Home = (props: Properties) => {

    const navigateSettings = () => {
        props.updateView('Settings');
    }

  return (
    <SafeAreaView style={styles.content}>
      <Text style={styles.textBody}>Home Test</Text>
      <TouchableHighlight style={styles.iconButtonContainer} onPress={navigateSettings}>
          <FontAwesomeIcon icon={faCog} style={styles.iconButton} />
      </TouchableHighlight>
    </SafeAreaView>
  );
}

export default Home;