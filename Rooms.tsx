import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  Alert,
  FlatList
} from 'react-native';

import { format } from 'date-fns'
import styles from './AppStyles'
import Room from './Room'

interface Properties {
    updateView: Function,
    apiEndpoint: string,
    apiPIN: string
}

interface RoomData {
    name: string,
    fahrenheit: string,
    celcius: string,
    humidity: string
}

const Rooms = (props: Properties) => {
    let roomDataArray = Array<RoomData>();
    const [roomList, setRoomList] = React.useState(roomDataArray);
    const [refreshDate, setRefreshDate] = React.useState("");

    const goBackHome = () => {
        props.updateView('Home');
    }

    const getDateString = () => {
        let newDate = format(new Date(), 'MM-dd-yyyy hh:mm:ss');
        return newDate;
    }

    const fetchRoomTemperatures = async () => {
        setRoomList([]);
        try {

            fetch(props.apiEndpoint + '/temps/all')
            .then(response => {
                if(response.status !== 200){
                    Alert.alert("There was an error fetching the room temperatures");
                    return;
                }else{
                    return response.json();
                }
            })
            .then(data => {
                if(data){
                    console.log(data);
                    for(var index = 0; index < data.length; index++){
                        data[index].key = 'room' + index;
                    }
                    setRoomList(data);
                    setRefreshDate(getDateString());
                }
            })
            .catch((error) => {
                console.error('*****Error:', error);
            });
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        fetchRoomTemperatures();
    }, [])

  return (
    <SafeAreaView style={styles.content}>
        <Text style={styles.textBody}>Room Temperatures</Text>
        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => fetchRoomTemperatures() }>
            <Text style={styles.textButton}>Refresh Values</Text>
        </Pressable>
        
        <Text style={styles.textBody}>Refreshed: {refreshDate}</Text>

        <FlatList data={roomList}
        renderItem={({item}) => <Room name={item.name} fahrenheit={item.fahrenheit} celcius={item.celcius} humidity={item.humidity} /> }
        />

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => goBackHome()}>
            <Text style={styles.textButton}>Home</Text>
        </Pressable>
    </SafeAreaView>
  );
}

export default Rooms;