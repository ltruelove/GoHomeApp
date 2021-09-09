import React from 'react';
import {
  SafeAreaView,
  useColorScheme
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import ApiUrl from './ApiUrl'
import PinCode from './PinCode'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ApiUrl></ApiUrl>
      <PinCode></PinCode>
    </SafeAreaView>
  );
};

export default App;
