import React from 'react';
import {
  SafeAreaView,
  Text,
  Pressable
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import styles from '../constants/AppStyles'

const HomeScreen = ({ navigation }) => {

    const navigateSettings = () => {
        navigation.navigate('API Settings');
    }

    const navigateGarage = () => {
        navigation.navigate('Garage');
    }

    const navigateRooms = () => {
        navigation.navigate('Rooms');
    }

  return (
    <SafeAreaView style={styles.content}>
        <Pressable style={styles.iconButtonContainer} onPress={navigateGarage}>
            <Text style={styles.textButton}>Garage</Text>
        </Pressable>
        <Pressable style={styles.iconButtonContainer} onPress={navigateRooms}>
            <Text style={styles.textButton}>Room Temperatures</Text>
        </Pressable>
        <Pressable style={styles.iconButtonContainer} onPress={navigateSettings}>
            <Text style={styles.textButton}>
              <FontAwesomeIcon icon={faCog} style={styles.iconButton} /> Settings
            </Text>
        </Pressable>
    </SafeAreaView>
  );
}

export default HomeScreen;