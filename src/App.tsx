import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import ApiPinScreen from './screens/ApiPin';
import ApiUrlScreen from './screens/ApiUrl';
import HomeScreen from './screens/Home';
import GarageScreen from './screens/Garage';
import RoomsScreen from './screens/Rooms';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="API Settings" component={ApiUrlScreen} />
        <Stack.Screen name="API PIN" component={ApiPinScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Garage" component={GarageScreen} />
        <Stack.Screen name="Rooms" component={RoomsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
