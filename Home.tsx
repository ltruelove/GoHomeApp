import React from 'react';
import {
  SafeAreaView,
  Text,
  Pressable
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

    const navigateGarage = () => {
        props.updateView('Garage');
    }

    const navigateRooms = () => {
        props.updateView('Rooms');
    }

  return (
    <SafeAreaView style={styles.content}>
      <Text style={styles.textBody}>Home Test</Text>
      <Pressable style={styles.iconButtonContainer} onPress={navigateGarage}>
          <Text style={styles.textButton}>Garage</Text>
      </Pressable>
      <Pressable style={styles.iconButtonContainer} onPress={navigateRooms}>
          <Text style={styles.textButton}>Room Temperatures</Text>
      </Pressable>
      <Pressable style={styles.iconButtonContainer} onPress={navigateSettings}>
          <FontAwesomeIcon icon={faCog} style={styles.iconButton} />
      </Pressable>
    </SafeAreaView>
  );
}

export default Home;