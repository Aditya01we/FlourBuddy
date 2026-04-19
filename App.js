
import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import StackNavigator from './src/navigations/StackNavigator'


LogBox.ignoreAllLogs();


const App = () => {
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
};

export default App;


