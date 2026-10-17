import React, { useEffect, useState } from 'react';
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
  StatusBar,
  Dimensions,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import openMap from 'react-native-open-maps';
import firestore from '@react-native-firebase/firestore';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import menuData from '../../components/menu';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Homescreen = ({ navigation }) => {
  const [locationName, setLocationName] = useState('Fetching location...');
  const [displayAddress, setDisplayAddress] = useState('Loading address details...');
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [currentStore, setCurrentStore] = useState('David Flour Cafe');
  const [storesList, setStoresList] = useState([]);

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items || []);
  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestLocationPermission();
    }, 800);

    const unsubscribe = firestore()
      .collection('stores')
      .where('isActive', '==', true)
      .onSnapshot(
        querySnapshot => {
          const stores = [];
          querySnapshot.forEach(documentSnapshot => {
            stores.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setStoresList(stores);
          if (stores.length > 0 && !stores.some(s => s.storeName === currentStore)) {
            setCurrentStore(stores[0].storeName);
          }
        },
        error => {
          console.log('Firestore Error: ', error);
        }
      );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const showAlert = (title, message, buttons) => {
    InteractionManager.runAfterInteractions(() => {
      Alert.alert(title, message, buttons);
    });
  };

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
        setDisplayAddress(data.display_name || 'Address not found');
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state;
        setLocationName(city || 'Unknown');
      }
    } catch (error) {
      console.log('Invalid JSON response:', error);
      showAlert('Error', 'Failed to get address');
    }
  };

  const handleNotification = () => navigation.navigate("Notificationscreen");
  const handleRecommended = () => navigation.navigate("Recommendedscreen");
  const handleMenu = () => navigation.navigate("Menuscreen");
  
  const handleStoreChangeDropdown = () => {
    if (storesList.length === 0) {
      showAlert("Notice", "No stores available at the moment.");
      return;
    }

    const buttons = storesList.map(store => ({
      text: store.storeName,
      onPress: () => setCurrentStore(store.storeName),
    }));

    buttons.push({ text: "Cancel", style: "cancel" });

    showAlert("Select Store", "Choose your preferred store branch", buttons);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem} activeOpacity={0.85}>
      <View style={styles.categoryCircle}>
        <Image source={item.image} style={styles.categoryImg} />
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecommended = ({ item }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.productCard}>
        <View style={styles.recommendedImageCircle}>
          <Image source={item.image} style={styles.productImgCircular} />
        </View>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          {quantity > 0 ? (
            <View style={styles.homeCounter}>
              <TouchableOpacity style={styles.homeQtyBtn} onPress={() => dispatch(removeFromCart(item))}>
                <Ionicons name="remove" size={14} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.homeQtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.homeQtyBtn} onPress={() => dispatch(addToCart(item))}>
                <Ionicons name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={() => dispatch(addToCart(item))} activeOpacity={0.85}>
              <Ionicons name="add" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FAFAFA" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.headerContainer}>
          <Ionicons name="location" size={24} color="#BD8D46" style={styles.icon} />
          <TouchableOpacity style={styles.textContainer} onPress={handelOpenMaps} activeOpacity={0.7}>
            <View style={styles.titleRow}>
              <Text style={styles.cityText}>{locationName}</Text>
              <Ionicons name="chevron-down" size={14} color="#181725" style={styles.dropdown} />
            </View>
            <Text style={styles.addressText} numberOfLines={1}>{displayAddress}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationBtn} onPress={handleNotification} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#181725" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.StoreBar} onPress={handleStoreChangeDropdown} activeOpacity={0.85}>
          <View style={styles.leftBar}>
            <Ionicons name="storefront-outline" size={18} color="#FFF" />
            <Text style={styles.storelabel}>Store</Text>
          </View>
          <View style={styles.rightBar}>
            <Text style={styles.storename}>{currentStore}</Text>
            <Ionicons name="chevron-down" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.carouselContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            snapToInterval={SCREEN_WIDTH}
            decelerationRate="fast"
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false} 
          >
            <TouchableOpacity activeOpacity={0.95} style={styles.bannerWrapper}>
              <Image source={require('../../assets/images/carousel.png')} style={styles.img} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.95} style={styles.bannerWrapper}>
              <Image source={require('../../assets/images/carousel.png')} style={styles.img} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.95} style={styles.bannerWrapper}>
              <Image source={require('../../assets/images/carousel.png')} style={styles.img} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.orderBar} activeOpacity={0.9}>
          <View style={styles.orderLeft}>
            <Image source={require("../../assets/images/order.png")} style={styles.orderimg} resizeMode="contain" />
            <View style={styles.orderTextGroup}>
              <Text style={styles.cnfrm}>Order Confirmed</Text>
              <View style={styles.orderBottomRow}>
                <Text style={styles.itemCount}>6 Items</Text>
                <Text style={styles.divider}>•</Text>
                <Text style={styles.priceText}>Paid ₹2000</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward-circle" size={24} color="#BD8D46" />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Menu</Text>
          <TouchableOpacity onPress={handleMenu} activeOpacity={0.7}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menuData ? menuData.slice(8, 14) : []}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.exploreGrid}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity onPress={handleRecommended} activeOpacity={0.7}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menuData ? menuData.slice(1, 4) : []}
          renderItem={renderRecommended}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedScroll}
        />
      </ScrollView>

      {totalCount > 0 && (
        <TouchableOpacity style={styles.BottomCart} onPress={() => navigation.navigate("Cartscreen")} activeOpacity={0.95}>
          <Text style={styles.cartCountText}>{totalCount} {totalCount === 1 ? 'Item' : 'Items'} Added</Text>
          <View style={styles.cartRight}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Ionicons name="basket" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollPadding: {
    paddingBottom: responsiveHeight(12),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(1.5),
    paddingBottom: responsiveHeight(1.5),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  icon: {
    marginRight: responsiveWidth(3),
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
    fontWeight: '700',
  },
  dropdown: {
    marginLeft: responsiveWidth(1.5),
    marginTop: 2,
  },
  addressText: {
    fontSize: responsiveFontSize(1.35),
    color: '#7C7C7C',
    marginTop: responsiveHeight(0.2),
    fontFamily: 'Raleway-SemiBold',
  },
  notificationBtn: {
    width: responsiveWidth(10.5),
    height: responsiveWidth(10.5),
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  StoreBar: {
    backgroundColor: '#BD8D46',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveWidth(90),
    alignSelf: 'center',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4.5),
    marginTop: responsiveHeight(2),
    borderRadius: 16,
    shadowColor: '#BD8D46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: responsiveFontSize(1.6),
    color: '#FFFFFF',
    marginLeft: responsiveWidth(2),
    opacity: 0.9,
  },
  storename: {
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.7),
    color: '#FFFFFF',
    marginRight: responsiveWidth(1.5),
    fontWeight: '600',
  },
  carouselContainer: {
    width: SCREEN_WIDTH,
    marginTop: responsiveHeight(2.5),
  },
  bannerWrapper: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: responsiveWidth(90),
    height: responsiveHeight(20),
    borderRadius: 20,
    resizeMode: 'cover',
  },
  orderBar: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#FFFBEF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBE8CE',
    marginTop: responsiveHeight(2.5),
    shadowColor: '#BD8D46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderimg: {
    height: responsiveHeight(4.5),
    width: responsiveWidth(9),
  },
  orderTextGroup: {
    marginLeft: responsiveWidth(3.5),
  },
  cnfrm: {
    fontSize: responsiveFontSize(1.45),
    fontFamily: 'Poppins-Bold',
    color: '#181725',
    fontWeight: '700',
  },
  orderBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  itemCount: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(1.4),
    color: '#6C6C6C',
  },
  divider: {
    marginHorizontal: 6,
    color: '#C0C0C0',
    fontSize: responsiveFontSize(1.4),
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.4),
    color: '#BD8D46',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3.5),
    marginBottom: responsiveHeight(1.5),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Poppins-Bold',
    color: '#181725',
    fontWeight: '700',
  },
  viewAll: {
    color: '#BD8D46',
    fontFamily: 'Poppins-SemiBold',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },
  exploreGrid: {
    paddingHorizontal: responsiveWidth(4),
    justifyContent: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    width: responsiveWidth(29),
    marginHorizontal: responsiveWidth(1),
    marginBottom: responsiveHeight(2.5),
  },
  categoryCircle: {
    width: responsiveWidth(21),
    height: responsiveWidth(21),
    borderRadius: responsiveWidth(10.5),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryImg: {
    width: '60%',
    height: '60%',
    borderRadius: responsiveWidth(5.25),
    resizeMode: 'contain',
  },
  categoryName: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.25),
    fontFamily: 'Poppins-SemiBold',
    color: '#181725',
    textAlign: 'center',
    fontWeight: '500',
  },
  recommendedScroll: {
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(2),
  },
  productCard: {
    width: responsiveWidth(42),
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: responsiveWidth(3),
    marginRight: responsiveWidth(3.5),
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  recommendedImageCircle: {
    width: responsiveWidth(26),
    height: responsiveWidth(26),
    borderRadius: responsiveWidth(13),
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  productImgCircular: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(13),
    resizeMode: 'cover',
  },
  productName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: responsiveFontSize(1.35),
    marginTop: responsiveHeight(1.2),
    marginBottom: responsiveHeight(0.8),
    color: '#181725',
    fontWeight: '600',
    alignSelf: 'flex-start',
    width: '100%',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    width: '100%',
  },
  productPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.65),
    color: '#181725',
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: '#BD8D46',
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BD8D46',
    borderRadius: 10,
    paddingHorizontal: 4,
    height: 32,
  },
  homeQtyBtn: {
    padding: 3,
  },
  homeQtyText: {
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.5),
    marginHorizontal: 6,
    fontWeight: '700',
  },
  BottomCart: {
    position: 'absolute',
    bottom: responsiveHeight(2.5),
    alignSelf: 'center',
    width: responsiveWidth(90),
    backgroundColor: '#BD8D46',
    height: responsiveHeight(7),
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    shadowColor: '#BD8D46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  cartCountText: {
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.65),
    fontWeight: '700',
  },
  cartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
    fontSize: responsiveFontSize(1.75),
    marginRight: 6,
    fontWeight: '700',
  },
});