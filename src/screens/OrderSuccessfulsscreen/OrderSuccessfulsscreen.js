import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

Sound.setCategory('Playback');

const OrderSuccessfulsscreen = ({ navigation }) => {

  const handleTrack = async () => {
    try {
      const data = await AsyncStorage.getItem('myOrders');
      const orders = data ? JSON.parse(data) : [];

      if (orders.length === 0) return;

      const latestOrder = orders[0];

      console.log("TRACKING LOG: Navigating with Coordinates:", {
        lat: latestOrder.userLat,
        lng: latestOrder.userLng,
        address: latestOrder.fullAddress
      });

    navigation.replace('TrackOrderscreen', {
  userLat: latestOrder.userLat,
  userLng: latestOrder.userLng,
  displayAddress: latestOrder.fullAddress,
  locationName: latestOrder.deliveryLocation,
  orderId: latestOrder.id,
  orderDate: latestOrder.date,
  orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Real time
  itemCount: latestOrder.cartLength,
  items: latestOrder.items,
  totalAmount: latestOrder.totalAmount
});

    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) return;

      const soundTimeout = setTimeout(() => {
        successSound.play();
      }, 2500);

      return () => clearTimeout(soundTimeout);
    });

    return () => {
      successSound.stop();
      successSound.release();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Image source={require('../../assets/images/successful.png')} />
        </View>

        <Text style={styles.title}>Order Successful</Text>
        <Text style={styles.subtitle}>Thank you for choosing Flour Buddy.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleTrack}>
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessfulsscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(10),
  },
  iconWrapper: {
    marginBottom: responsiveHeight(3),
  },
  title: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: '700',
    color: '#000000',
    marginBottom: responsiveHeight(1),
  },
  subtitle: {
    fontSize: responsiveFontSize(2),
    color: '#7C7C7C',
  },
  footer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
  },
  button: {
    backgroundColor: '#BC8F4F',
    height: responsiveHeight(7),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
  },
});