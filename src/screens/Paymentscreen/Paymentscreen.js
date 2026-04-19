import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  AppState,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const Paymentscreen = ({ navigation, route }) => {
  const {
    id,
    totalAmount,
    userName,
    locationName,
    displayAddress,
    subtotal,
    discountAmount,
    taxAmount,
    userLat, 
    userLng,
  } = route.params;
  const cartItems = useSelector(state => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const saveOrderToMyOrders = async () => {
    const newOrder = {
      id: Math.floor(Math.random() * 1000).toString(),
      shopName: 'David Flour Cafe',
      shopAddress: 'Faridabad - Gurgaon Rd',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }),
      totalAmount: totalAmount.toLocaleString(),
      subtotal: subtotal,
      discount: discountAmount,
      tax: taxAmount,
      deliveryLocation: locationName,
      fullAddress: displayAddress,

userLat: userLat, 
      userLng: userLng,

      // From Redux
      items: cartItems,
      cartLength: cartItems.length,
      status: 'DELIVERED',
    };

    try {
      const existing = await AsyncStorage.getItem('myOrders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(newOrder);
      await AsyncStorage.setItem('myOrders', JSON.stringify(orders));
      console.log('SUCCESS: Order saved to local storage:', newOrder);
    } catch (e) {
      console.error('Save Error', e);
    }
  };
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        console.log('AppState Changed to:', nextAppState);
        if (nextAppState === 'active' && isPaymentPending) {
          console.log('User returned from UPI app. Starting verification...');
          setIsPaymentPending(false);
          setIsProcessing(true);

          await saveOrderToMyOrders();

          setTimeout(() => {
            setIsProcessing(false);
            navigation.replace('OrderSuccessfulsscreen', {
userLat: route.params.userLat,
  userLng: route.params.userLng,
        displayAddress: displayAddress,
        locationName: locationName,
        orderId: id,
        orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
        orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itemCount: cartItems.length,
        items: cartItems,
        totalAmount: totalAmount,
      });
          }, 10000);
          console.log('order successfull');
        }
      },
    );

    return () => subscription.remove();
  }, [isPaymentPending, navigation]);

  const handlePayment = async () => {
    if (paymentMethod === 'Online') {
      const UPI_ID = '9528230119@axl';
      const payeeName = encodeURIComponent(userName);
      const amount = totalAmount.toString();
      const url = `upi://pay?pa=${UPI_ID}&pn=${payeeName}&am=${amount}&cu=INR`;

      try {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
          setIsPaymentPending(true);
          await Linking.openURL(url);
        } else {
          // Fallback attempt for devices that don't report support correctly
          await Linking.openURL(url)
            .then(() => setIsPaymentPending(true))
            .catch(() => {
              Alert.alert(
                'UPI App Not Found',
                'Please install GPay, PhonePe, or Paytm.',
              );
            });
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to launch payment app.');
      }
    } else {
      setIsProcessing(true);

      await saveOrderToMyOrders();

      setTimeout(() => {
        setIsProcessing(false);
        navigation.replace('OrderSuccessfulsscreen', {
          userLat: route.params.userLat,
          userLng: route.params.userLng,
          displayAddress: displayAddress, 
              locationName: locationName,     
        });
      }, 3000);

      console.log('COD Order placed successfully');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Option</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>To Pay</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.amountText}>
            ₹ {totalAmount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPI</Text>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setPaymentMethod('Online')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Pay by any UPI App</Text>
            <Ionicons
              name={
                paymentMethod === 'Online'
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={24}
              color="#BC8A45"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards</Text>
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Cards', 'Card integration is coming soon.')
            }
          >
            <Text style={styles.optionText}>Add Debit/Credit Card</Text>
            <Ionicons name="chevron-forward" size={20} color="#7C7C7C" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay on Delivery</Text>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setPaymentMethod('COD')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Cash/UPI on delivery</Text>
            <Ionicons
              name={
                paymentMethod === 'COD' ? 'radio-button-on' : 'radio-button-off'
              }
              size={24}
              color="#BC8A45"
            />
          </TouchableOpacity>
        </View>
      </View>

      {isProcessing && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#BC8A45" />
          <Text style={styles.loaderText}>Verifying Order....</Text>
          <Text style={styles.subLoaderText}>
            Please do not press back or close the app
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handlePayment}>
          <Text style={styles.confirmBtnText}>
            {paymentMethod === 'Online' ? 'Pay Now' : 'Confirm Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Paymentscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: '#000',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  sectionLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  totalCard: {
    backgroundColor: '#BC8A45',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 35,
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '500',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F3F2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionText: {
    fontSize: responsiveFontSize(1.8),
    color: '#444',
    fontWeight: '500',
  },
  footer: {
    padding: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
  },
  confirmBtn: {
    backgroundColor: '#BC8A45',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    backgroundColor: '#FFF',
    width: responsiveWidth(80),
    paddingVertical: responsiveHeight(5),
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  loaderText: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#000',
  },
  subLoaderText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
});
