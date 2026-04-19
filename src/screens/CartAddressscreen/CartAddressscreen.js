import {
  PermissionsAndroid,
  Alert,
  View,
  Text,
  Linking,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  InteractionManager,
  TextInput,
  // Linking
} from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import openMap from 'react-native-open-maps';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, setAddress } from '../../redux/cartSlice';
import Address from '../../components/Address';
import Addressscreen from '../Addressscreen/Addressscreen';

const CartAddressscreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const deliveryLocation = useSelector(state => state.cart.deliveryLocation);
  const cartItems = useSelector(state => state.cart.items);
  const userProfile = useSelector(state => state.user?.profile);
  const userName = userProfile?.name || 'Valued Customer';

  //   const [orderType, setOrderType] = useState('Delivery');
  const [couponCode, setCouponCode] = useState('CBFLOUR-10');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [locationName, setLocationName] = useState('Fetching location...');
  const [displayAddress, setDisplayAddress] = useState(
    'Loading address details...',
  );
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
useEffect(() => {
  
    if (!deliveryLocation || !deliveryLocation.isManual) {
      getCurrentLocation();
    } else {
     
      setCoords({ 
        latitude: deliveryLocation.coords.latitude, 
        longitude: deliveryLocation.coords.longitude 
      });
    }
}, [deliveryLocation]);
  const getCurrentLocation = () => {
    const getLowAccuracyLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          fetchAddress(latitude, longitude);
        },
        error => {
          console.log('Location Error:', error);
          setLocationName('Location Error');
          setDisplayAddress('Could not fetch location. Please check GPS.');
        },
        { enableHighAccuracy: false, timeout: 10000 },
      );
    };

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        fetchAddress(latitude, longitude);
      },
      error => {
        console.log('High Accuracy Error, trying fallback...', error.message);
        // Fallback to Network/Wifi if GPS times out or fails
        getLowAccuracyLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
      },
    );
  };

const fetchAddress = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'MyApp/1.0',
          Accept: 'application/json',
        },
      },
    );

    const data = await response.json();

    // Check if we have data and if the user HAS NOT added a manual address
    if (data && data.address && !deliveryLocation?.isManual) {
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state || 
        'Current Location';

      const fullAddress = data.display_name;

      // Update Local State for immediate UI feedback
      setLocationName(city);
      setDisplayAddress(fullAddress);

      // Update Redux Store to sync across all screens
      dispatch(setAddress({
        title: city,
        address: fullAddress,
        isManual: false,
  coords: { latitude: lat, longitude: lng }
      }));
    }
  } catch (error) {
    console.log('Fetch Error:', error);
    setLocationName('Error');
    setDisplayAddress('Failed to get address details');
  }
};

  const handlePlaceOrder = async () => {
    // const UPI_ID = '9528230119@axl';
    // const amount = totalAmount.toString();
    // const encodedName = encodeURIComponent(userName);
    // const encodedNote = encodeURIComponent(`Order by ${userName}`);

    // if (paymentMethod === 'Online') {
    //   const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`;

    //   try {
    //     const isSupported = await Linking.canOpenURL(upiUrl);

    //     if (isSupported) {
    //       await Linking.openURL(upiUrl);
    //       navigation.replace("OrderSuccessfulsscreen");
    //     } else {
    //       await Linking.openURL(upiUrl).catch(() => {
    //         Alert.alert(
    //           'UPI App Not Found',
    //           'Please install GPay, PhonePe, or Paytm to complete your online payment.'
    //         );
    //       });
    //       navigation.replace("OrderSuccessfulsscreen");
    //     }
    //   } catch (error) {
    //     console.error("[Payment Error]:", error);
    //     Alert.alert('Payment Error', 'Unable to open payment apps at this time.');
    //   }
    //   return;
    // }
    navigation.replace('Paymentscreen', {
      // Basic Info
      totalAmount: totalAmount,
      userName: userName,

      // Exact Location Details for the 'Delivered to' section
      locationName: deliveryLocation.title,
      displayAddress: deliveryLocation.address,
      userLat: coords.latitude,
      userLng: coords.longitude,
      // Bill Breakdown for 'Payment Info' section
      subtotal: subtotal, // Items total
      discountAmount: discount, // Applied coupon/discount
      taxAmount: cgst + sgst, // Total Taxes (Cgst + Sgst)
      roundOff: roundOff, // Round off value
    });
  };
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  //   const deliveryCharge = orderType === 'Delivery' ? 0 : 0;
  const discount = 20;
  const gstRate = 0.025; // 2.5%
  const cgst = Math.round(subtotal * gstRate);
  const sgst = Math.round(subtotal * gstRate);
  const roundOff = 3;

  const totalAmount = subtotal + cgst + sgst + roundOff - discount;

  const renderCartItem = item => (
    <View key={item.id} style={styles.cartCard}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity>
            <Ionicons name="close-outline" size={20} color="#7C7C7C" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemSubtext}>
          {item.coarse || 'Fine'} | {item.unit || '1kg'}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>₹ {item.price}</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item))}>
              <Ionicons name="remove" size={16} color="#000" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => dispatch(addToCart(item))}>
              <Ionicons name="add" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.rightsectiontitle}>Address</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Addressscreen")}>
          <Text style={styles.leftsectiontitle}>{deliveryLocation.isManual ? "Change" : "Add"}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.toggleContainer}>
          {['Delivery', 'Takeaway'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleBtn,
                orderType === type && styles.activeToggle,
              ]}
              onPress={() => setOrderType(type)}
            >
              <Ionicons
                name={
                  orderType === type ? 'radio-button-on' : 'radio-button-off'
                }
                size={20}
                color={orderType === type ? '#BD8D46' : '#7C7C7C'}
              />
              <Text
                style={[
                  styles.toggleText,
                  orderType === type && styles.activeToggleText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        <View style={styles.Address}>
          <View style={styles.titleRow}>
          <Text style={styles.cityText}>{deliveryLocation.title}</Text>
          </View>
          <Text style={styles.addressText} numberOfLines={2}>
           {deliveryLocation.address}
          </Text>
        </View>

        <Text style={styles.rightsectiontitle}>Order List</Text>
        {cartItems.map(item => renderCartItem(item))}

        <View style={styles.couponWrapper}>
          <View style={styles.couponInputContainer}>
            <TextInput
              style={styles.couponInput}
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Enter Coupon"
            />
            <TouchableOpacity style={styles.couponBtn}>
              <Text style={styles.couponBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.availableCoupons}>
            {['FLOURCG40', 'FLOURER30', 'FLOURAR10'].map(cpn => (
              <TouchableOpacity
                key={cpn}
                style={styles.cpnItem}
                onPress={() => setCouponCode(cpn)}
              >
                <Text style={styles.cpnText}>{cpn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.rightsectiontitle}>Bill Details</Text>
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Sub Total</Text>
            <Text style={styles.billValue}>₹ {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery charge</Text>
            <Text style={styles.billValue}>Free</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount amount</Text>
            <Text style={styles.discountText}>
              - ₹ {discount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Cgst (2.5%)</Text>
            <Text style={styles.billValue}>₹ {cgst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Sgst (2.5%)</Text>
            <Text style={styles.billValue}>₹ {sgst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Round off</Text>
            <Text style={styles.billValue}>₹ {roundOff}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₹ {totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* <Text style={styles.rightsectiontitle}>Payment Method</Text>
        <View style={styles.paymentContainer}>
          {['Cash on Delivery', 'Online'].map(method => (
            <TouchableOpacity
              key={method}
              style={styles.payOption}
              onPress={() => setPaymentMethod(method)}
            >
              <Ionicons
                name={
                  paymentMethod === method
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={22}
                color="#BD8D46"
              />
              <Text style={styles.payText}>{method}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          {paymentMethod === 'Online' ? 'Pay Now' : 'Place Order'}
          <View style={styles.priceContainer}>
            <Text style={styles.btnPrice}>
              ₹ {totalAmount.toLocaleString()}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartAddressscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Raleway-Bold',
    marginLeft: responsiveWidth(3),
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(12),
  },
  rightsectiontitle: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1.5),
  },

  //   toggleContainer: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-between'
  //    },
  //   toggleBtn: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     backgroundColor: '#FFF',
  //     width: '48%',
  //     padding: responsiveHeight(1.8),
  //     borderRadius: 12,
  //     borderWidth: 1,
  //     borderColor: '#F2F3F2',
  //   },
  //   activeToggle: {
  //      borderColor: '#BD8D46'
  //     },
  //   toggleText: {
  //     marginLeft: 10,
  //     fontSize: responsiveFontSize(1.8),
  //     color: '#7C7C7C',
  //   },
  //   activeToggleText: {

  //     color: '#000',

  //     fontWeight: 'bold'
  //    },

  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  itemImage: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,

    marginLeft: responsiveWidth(4),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Raleway-Bold',
    color: '#181725',
    flex: 1,
  },
  itemSubtext: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    marginVertical: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Bold',
    color: '#181725',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 8,
    padding: 4,
  },
  counterText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },

  couponWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F3F2',
    overflow: 'hidden',
  },
  couponInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  couponInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  couponBtn: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  couponBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  availableCoupons: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F3F2',
  },
  cpnItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  cpnText: {
    color: '#7C7C7C',
    fontSize: 14,
    fontWeight: '500',
  },

  billCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 15,
    color: '#7C7C7C',
  },
  billValue: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  discountText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F2F3F2',
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
  },
  totalValue: { fontSize: 17, color: '#000', fontWeight: 'bold' },

  paymentContainer: {
    marginBottom: 20,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  payText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#181725',
    fontWeight: '500',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
  },
  placeOrderBtn: {
    backgroundColor: '#BD8D46',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnPrice: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  Address: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: responsiveWidth(2),
    marginBottom: responsiveHeight(1),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: responsiveFontSize(2),
    color: '#181725',
    fontFamily: 'Poppins-Bold',
  },
  addressText: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    marginTop: responsiveHeight(0.2),
    fontFamily: 'Raleway-SemiBold',
  },
  leftsectiontitle: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1.5),
    color: '#BD8D46',
  },
});
