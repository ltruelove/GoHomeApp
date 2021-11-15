import * as React from 'react';
import {
  SafeAreaView,
  Text,
} from 'react-native';
import styles from '../AppStyles'

interface RoomData {
    name: string,
    fahrenheit: string,
    celcius: string,
    humidity: string,
    error: string
}

const Room = (props: RoomData) => {
  return (
    <SafeAreaView >
        <Text style={styles.textHeader}>{props.name}</Text>
        { !props.error ?
          <Text style={styles.textBody}>
            Fahrenheit: {props.fahrenheit}, Celcius: {props.celcius}, Humidity: {props.humidity}%
          </Text>
          :
          <Text style={styles.textBody}>
            {props.error}
          </Text>
        }
    </SafeAreaView>
  );
}

export default Room;