import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  Alert,
  View
} from 'react-native';

import styles from './AppStyles'

interface Properties {
    updateView: Function,
    apiEndpoint: string,
    apiPIN: string
}

const Garage = (props: Properties) => {
    const [doorStatus, updateDoorStatus] = React.useState('unknown');
    const [humidity, updateHumidity] = React.useState('');
    const [fahrenheit, updateFahrenheit] = React.useState('');
    const [celcius, updateCelcius] = React.useState('');

    const goBackHome = () => {
        props.updateView('Home');
    }

    const clickGarageDoorButton = async () => {
        try {
            const postBody = JSON.stringify({ "pinCode" :props.apiPIN })

            console.log(postBody);
            fetch(props.apiEndpoint + '/clickGarageDoorButton', {
                method: 'POST',
                body: postBody
            })
            .then(response => {
                if(response.status !== 200){
                    Alert.alert("There was an error clicking the garage door button");
                    return;
                }else {
                    response.json().then((data) => {
                        if(data.IsValid){
                            Alert.alert("Button clicked successfully!");
                            console.log(data);
                        }
                    })
                }
            })
            .catch((error) => {
                console.error('*****Error:', error);
            });
        } catch (error) {
            console.error(error);
        }
    }

    const clearGarageData = () => {
        updateHumidity('');
        updateFahrenheit('');
        updateCelcius('');
        updateDoorStatus('unknown');
    }

    const fetchGarageStatus = async () => {
        clearGarageData();
        try {
            fetch(props.apiEndpoint + '/doorStatus')
            .then(response => {
                if(response.status !== 200){
                    Alert.alert("There was an error fetching the garage status");
                    return;
                }else{
                    return response.json();
                }
            })
            .then(data => {
                if(data){
                    updateHumidity(data.humidity);
                    updateFahrenheit(data.fahrenheit);
                    updateCelcius(data.celcius);
                    updateDoorStatus(data.doorClosed === 1 ? "No" : "Yes");
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
        fetchGarageStatus();
    }, [])

  return (
    <SafeAreaView style={styles.content}>
        <View style={styles.leftContent}>
            <View style={styles.leftContentIndent}>
                <Text style={styles.textHeader}>Garage Status</Text>
                <Text style={styles.textBody}>Door open: {doorStatus}</Text>
                <Text style={styles.textBody}>Fahrenheit: {fahrenheit}</Text>
                <Text style={styles.textBody}>Celcius: {celcius}</Text>
                <Text style={styles.textBody}>Humidity: {humidity}%</Text>
            </View>
        </View>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => clickGarageDoorButton()}>
            <Text style={styles.textButton}>Click Garage Door Button</Text>
        </Pressable>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => fetchGarageStatus()}>
            <Text style={styles.textButton}>Refresh Data</Text>
        </Pressable>

        <Pressable
            style={styles.iconButtonContainer}
            onPress={ () => goBackHome()}>
            <Text style={styles.textButton}>Home</Text>
        </Pressable>
    </SafeAreaView>
  );
}

export default Garage;