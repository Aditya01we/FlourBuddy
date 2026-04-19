import { StyleSheet, View, Image, StatusBar } from 'react-native';
import React, { useEffect } from 'react';

import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const Splashscreen = ({ navigation }) => {
  useEffect(() => {
   
    const timer = setTimeout(() => {
      navigation.replace('Loginscreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#BC8A45" barStyle="light-content" />
      
      <Image
        source={require('../../assets/images/Splash.png')} 
        style={styles.image}
      />
    </View>
  );
};

export default Splashscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BC8A45', 
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {

    width: responsiveWidth(100), 
    height: responsiveHeight(120), 
    resizeMode: 'contain',
  },
});