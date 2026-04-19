import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import openMap from 'react-native-open-maps';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import menuData from '../../components/menu';

const Homescreen = ({navigation}) => {
  const [locationName, setLocationName] = useState('Fetching location...');
  const [displayAddress, setDisplayAddress] = useState('Loading address details...');
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });

  const showAlert = (title, message, buttons) => {
    InteractionManager.runAfterInteractions(() => {
      Alert.alert(title, message, buttons);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      requestLocationPermission();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handelOpenMaps = () => {
    if (coords.latitude !== 0) {
      openMap({
        latitude: coords.latitude,
        longitude: coords.longitude,
        provider: "google",
        zoom: 18,
        query: locationName
      });
    } else {
      showAlert("Error", "Location coordinates not available.");
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Enable location for better experience',
          buttonNegative: 'No Thanks',
          buttonPositive: 'Turn on',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        showAlert('Permission Blocked', 'Enable it from settings', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
      } else {
        showAlert('Permission Denied');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Lat:', latitude, 'Lng:', longitude);
        setCoords({ latitude, longitude });
        fetchAddress(latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
        showAlert('Error', 'Location not fetched');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
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
      if (data) {
        setDisplayAddress(data.display_name);

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state;

        setLocationName(city || 'Unknown');
      }
    } catch (error) {
      console.log('Invalid JSON response:', error);
      showAlert('Error', 'Failed to get address');
    }
  };

  const handleNotification = () => {
    navigation.navigate("Notificationscreen")
  };

  const handleRecommended = () => {
    navigation.navigate("Recommendedscreen")
  };

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenu = () =>{
    navigation.navigate("Menuscreen")
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryCircle}>
        <Image source={item.image} style={styles.categoryImg} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecommended = ({ item }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.productCard}>
        <Image source={item.image} style={styles.productImg} />
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹ {item.price}</Text>
          
          {quantity > 0 ? (
            <View style={styles.homeCounter}>
              <TouchableOpacity style={styles.homeQtyBtn} onPress={() => dispatch(removeFromCart(item))}>
                <Ionicons name="remove" size={16} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.homeQtyText}>{quantity}</Text>

              <TouchableOpacity style={styles.homeQtyBtn} onPress={() => dispatch(addToCart(item))}>
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={() => dispatch(addToCart(item))}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Ionicons name="location" size={24} color="#000" style={styles.icon} />
          <TouchableOpacity style={styles.textContainer} onPress={handelOpenMaps} >
            <View style={styles.titleRow}>
              <Text style={styles.cityText}>{locationName}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" style={styles.dropdown} />
            </View>
            <Text style={styles.addressText} numberOfLines={1}>
              {displayAddress}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationBtn} onPress={handleNotification}>
            <Ionicons name="notifications-outline" size={responsiveFontSize(3)} color="#181725" />
          </TouchableOpacity>
        </View>

        <View style={styles.StoreBar}>
          <View style={styles.leftBar}>
            <Ionicons name="storefront" size={20} color="#FFF" />
            <Text style={styles.storelabel}>Store</Text>
          </View>
          <View style={styles.rightBar}>
            <Text style={styles.storename}>David Flour Cafe</Text>
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </View>
        </View>

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Image source={require('../../assets/images/carousel.png')} style={styles.img} />
          <Image source={require('../../assets/images/carousel.png')} style={styles.img} />
          <Image source={require('../../assets/images/carousel.png')} style={styles.img} />
        </ScrollView>

        <TouchableOpacity style={styles.orderBar}>
          <View style={styles.orderLeft}>
            <Image source={require("../../assets/images/order.png")} style={styles.orderimg} resizeMode="contain" />
            <View style={styles.orderTextGroup}>
              <Text style={styles.cnfrm}>Order Confirmed</Text>
              <View style={{ flexDirection: "row", gap: 2.5 }}>
                <Text style={styles.itemCount}>6 Items (s)</Text>
                <Text style={styles.divider}>|</Text>
                <Text style={styles.priceText}>Paid ₹2000</Text>
              </View>
            </View>
          </View>
          <View style={styles.orderimg}>
            <Ionicons name="chevron-forward" size={20} color="#BD8D46" />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore menu</Text>
          <TouchableOpacity onPress={handleMenu}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menuData.slice(8, 14)}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.exploreGrid}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={handleRecommended}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menuData.slice(1, 4)}
          renderItem={renderRecommended}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedScroll}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
    marginTop: responsiveHeight(0.8),
  },
  icon: {
    marginRight: responsiveWidth(2),
  },
  textContainer: {
    flex: 1,
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
  dropdown: {
    marginLeft: responsiveWidth(1),
  },
  addressText: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    marginTop: responsiveHeight(0.2),
    fontFamily: 'Raleway-SemiBold',
  },
  notificationBtn: {
    padding: responsiveHeight(0.5),
  },
  StoreBar: {
    backgroundColor: '#C68E4E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(1),
  },
  leftBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storelabel: {
    fontFamily: 'Raleway-Medium',
    fontSize: responsiveFontSize(1.9),
    color: '#FFFFFF',
    marginLeft: responsiveWidth(2),
  },
  storename: {
    fontFamily: 'Raleway-Bold',
    fontSize: responsiveFontSize(2),
    color: '#FFFFFF',
    marginRight: responsiveWidth(1),
  },
  img: {
    width: responsiveWidth(90),
    height: responsiveHeight(15),
    borderRadius: 15,
    marginRight: responsiveWidth(10),
    marginTop: responsiveHeight(3),
  },
  scroll: {
    paddingHorizontal: responsiveWidth(5),
  },
  homeCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BD8D46',
    borderRadius: 8,
    paddingHorizontal: 4,
    height: 30,
    justifyContent: 'space-between',
  },
  homeQtyBtn: {
    padding: 2,
  },
  homeQtyText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.6),
    marginHorizontal: 8,
  },
  orderBar: {
    width: responsiveWidth(90),
    height: responsiveHeight(8),
    backgroundColor: "#BD8D460D",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: 'center',
    //     marginTop: responsiveHeight(3),
    // marginBottom: responsiveHeight(2),
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#BD8D46',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  orderimg: {
    height: responsiveHeight(5),
    width: responsiveWidth(10),
  },
  orderTextGroup: {
    marginLeft: responsiveWidth(3),
    //     paddingHorizontal: responsiveWidth(5),
    // marginTop: responsiveHeight(3),
    gap: 2
  },
  itemCount: {
    fontFamily: 'Poppins',
    fontSize: responsiveFontSize(1.8),
    color: '#181725',
  },
  priceText: {
    fontFamily: 'Raleway',
    fontSize: responsiveFontSize(1.6),
    padding: 2
  },
  orderLeft: {
    flexDirection: "row"
  },
  cnfrm: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Raleway-SemiBold'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Poppins-Bold',
    color: '#181725',
  },
  viewAll: {
    color: '#BD8D46',
    fontFamily: 'Raleway-Bold',
  },
  exploreGrid: {
    paddingHorizontal: responsiveWidth(5),
  },
  categoryItem: {
    alignItems: 'center',
    width: responsiveWidth(30), 
    marginBottom: responsiveHeight(2),
  },
  //   addBtn: {
  //   backgroundColor: '#BD8D46',
  //   width: 30,
  //   height: 30,
  //   borderRadius: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // addText: {
  //   color: '#FFF',
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // }
  categoryCircle: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  categoryImg: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Raleway-SemiBold',
    textAlign: 'center',
  },
  recommendedScroll: {
    paddingLeft: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
  },
  productCard: {
    width: responsiveWidth(42),
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    marginRight: responsiveWidth(4),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  productImg: {
    width: '100%',
    height: responsiveHeight(12),
    resizeMode: 'contain',
  },
  productName: {
    fontFamily: 'Raleway-Bold',
    fontSize: responsiveFontSize(1.8),
    marginVertical: 5,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(2),
  },
  BottomCArt: {
    position: 'absolute',
    bottom: responsiveHeight(2),
    alignSelf: 'center',
    width: responsiveWidth(50),
    backgroundColor: '#BD8D46',
    height: responsiveHeight(7),
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),

  },
  // cartLeft: {
  //   justifyContent: 'center',
  // },
  cartCountText: {
    color: '#FFF',
    fontFamily: 'Raleway-Medium',
    fontSize: responsiveFontSize(1.5),
  },
  // cartPriceText: {
  //   color: '#FFF',
  //   fontFamily: 'Poppins-Bold',
  //   fontSize: responsiveFontSize(2),
  // },
  cartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewCartText: {
    color: '#FFF',
    fontFamily: 'Raleway-Bold',
    fontSize: responsiveFontSize(2),
    marginRight: 5,
  },
  addBtn: {
    backgroundColor: '#BD8D46',
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});