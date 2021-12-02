import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  Alert,
  FlatList,
  View
} from 'react-native';

import { format } from 'date-fns'
import styles from '../constants/AppStyles'
import Room from '../components/molecules/Room'
import EncryptedStorage from 'react-native-encrypted-storage';
import Globals from '../constants/Globals'
import { NavigationContainer } from '@react-navigation/native';

interface RoomData {
    name: string,
    fahrenheit: string,
    celcius: string,
    humidity: string,
    errorMessage: string
}

const RoomsScreen = ({ navigation }) => {
    let roomDataArray = Array<RoomData>();
    const [roomList, setRoomList] = React.useState(roomDataArray);
    const [refreshDate, setRefreshDate] = React.useState("");

    const goBackHome = () => {
        navigation.navigate('Home');
    }

    const getDateString = () => {
        let newDate = format(new Date(), 'MM-dd-yyyy hh:mm:ss');
        return newDate;
    }

    const fetchRoomTemperatures = async () => {
        setRoomList([]);
        try {
            let apiEndpoint = await EncryptedStorage.getItem(Globals.API_ENDPOINT_NAME);

            let response = await fetch(apiEndpoint + '/temps/all');
            if(!response.ok){
                Alert.alert("There was an error fetching the room temperatures");
                return;
            }else{
                let data = await response.json();
                if(data){
                    for(var index = 0; index < data.length; index++){
                        data[index].key = 'room' + index;
                    }
                    setRoomList(data);
                    setRefreshDate(getDateString());
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        fetchRoomTemperatures();
    }, [])

  return (
    <SafeAreaView style={styles.content}>
        <View style={[styles.leftContent, styles.roomList]}>
            
            <Text style={styles.textBody}>Refreshed: {refreshDate}</Text>

            <FlatList data={roomList}
                renderItem={({item}) =>
                    <Room name={item.name}
                    fahrenheit={item.fahrenheit}
                    celcius={item.celcius}
                    humidity={item.humidity}
                    error={item.errorMessage} /> 
                }
            />
        </View>
        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => fetchRoomTemperatures() }>
            <Text style={styles.textButton}>Refresh Values</Text>
        </Pressable>
        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => goBackHome()}>
            <Text style={styles.textButton}>Home</Text>
        </Pressable>
    </SafeAreaView>
  );
}

export default RoomsScreen;