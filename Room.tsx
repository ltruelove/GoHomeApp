import * as React from 'react';
import {
  SafeAreaView,
  Text,
} from 'react-native';
import styles from './AppStyles'

interface RoomData {
    name: string,
    fahrenheit: string,
    celcius: string,
    humidity: string
}

const Room = (props: RoomData) => {
  return (
    <SafeAreaView style={styles.content}>
        <Text style={styles.textHeader}>{props.name}</Text>
        <Text style={styles.textBody}>Fahrenheit: {props.fahrenheit}, Celcius: {props.celcius}, Humidity: {props.humidity}%</Text>
    </SafeAreaView>
  );
}

export default Room;