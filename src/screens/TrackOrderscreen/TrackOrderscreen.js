import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';

// import { responsiveHeight } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storeImgAssets from '../../assets/images/store.png';
import placeholderImgAssets from '../../assets/images/placeholder.png';
import bikeImgAsset from '../../assets/images/delivery-bike.png';
import StepIndicator from 'react-native-step-indicator';
import NotificationService from '../../services/NotificationServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const TrackOrderscreen = ({ route, navigation }) => {
  
const { 
    userLat, 
    userLng, 
    displayAddress, 
    locationName,
    id,
    orderDate,
    orderTime,
    itemCount,
    items,
    totalAmount
  } = route.params || {};

  console.log("Received Coords from Route:", userLat, userLng);
const [currentStep, setCurrentStep] = useState(route.params?.status === 'DELIVERED' ? 3 : 0);
  const shopLat = 28.4089;
  const shopLng = 77.3178;

const destLat = parseFloat(userLat) || 0;
const destLng = parseFloat(userLng) || 0;


  //reload map if dest changes
const mapKey = `map-${destLat}-${destLng}`;

  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

useEffect(() => {

  if (currentStep < 3) {
    const timer1 = setTimeout(() => {
      setCurrentStep(1);
    }, 10000);

    const timer2 = setTimeout(() => {
      setCurrentStep(2);
    }, 25000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }
}, []);
  
 useEffect(() => {
    if (currentStep === 2 && webViewRef.current) {
      webViewRef.current.postMessage("START_BIKE");
    }

  
    switch (currentStep) {
      case 1:
        const title1 = "Order Confirmed";
        const body1 = "Preparing your order.";
        NotificationService.showNotification(title1, body1);
        saveNotification(title1, body1);
        break;
      case 2:
        const title2 = "Out for Delivery";
        const body2 = "Your rider is on the way with your order!";
        NotificationService.showNotification(title2, body2, true);
        saveNotification(title2, body2);
        break;
      case 3:
        NotificationService.cancelAll();
        const title3 = "Order Delivered!";
        const body3 = "Your order has been delivered! Thank you for choosing us.";
        NotificationService.showNotification(title3, body3);
        saveNotification(title3, body3);
        break;
      default:
        break;
    }
  }, [currentStep]);

  if (isNaN(destLat) || isNaN(destLng)) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text>Delivery location not found</Text>
      </SafeAreaView>
    );
  }

  const bikeUri = Image.resolveAssetSource(bikeImgAsset).uri;
  const storeUri = Image.resolveAssetSource(storeImgAssets).uri;
  const placeholderUri = Image.resolveAssetSource(placeholderImgAssets).uri;

   const labels = ["Confirmed", "In Progress", "Out for Delivery", "Delivered"];

const stepIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorFinishedColor: '#BC8A45',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#BC8A45',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#BC8A45',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 10,
  currentStepLabelColor: '#000000',
  labelFontWeight: '600',
};

if (!userLat || !userLng) {
    console.log("Tracking Error: Waiting for user coordinates...");
  }

  const saveNotification = async (title, body) => {
  try {
    const existing = await AsyncStorage.getItem('userNotifications');
    const notification = existing ? JSON.parse(existing) : [];
    
    const newNotification = {
      title,
      body,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    notification.unshift(newNotification);
    await AsyncStorage.setItem('userNotifications', JSON.stringify(notification));
  } catch (e) {
    console.error(e);
  }
};



 const mapHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      #map { height: 100vh; width: 100vw; margin: 0; background: #f0f0f0; }
      .leaflet-control-attribution { display: none !important; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      // Coordinates
      var start = [${shopLat}, ${shopLng}];
      var end = [${destLat}, ${destLng}];

      // Initialize Map centered on start
      var map = L.map('map', { zoomControl: false }).setView(start, 13);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      // Icons
      var shopIcon = L.icon({ iconUrl: '${storeUri}', iconSize: [35, 35] });
      var homeIcon = L.icon({ iconUrl: '${placeholderUri}', iconSize: [35, 35] });
      var bikeIcon = L.icon({ iconUrl: '${bikeUri}', iconSize: [40, 40], iconAnchor: [20, 20] });

      // Add Shop and User Markers
      L.marker(start, { icon: shopIcon }).addTo(map);
      L.marker(end, { icon: homeIcon }).addTo(map);

      // Draw Route Line
      var line = L.polyline([start, end], { color: '#BC8A45', weight: 4, dashArray: '5, 10' }).addTo(map);
      
      // CRITICAL: Ensure the map zooms to show BOTH points
      map.fitBounds(line.getBounds(), { padding: [50, 50] });

      // Delivery Bike Marker
    var bikeMarker = L.marker(${currentStep === 3 ? 'end' : 'start'}, { icon: bikeIcon }).addTo(map);
function animate() {
  if (${currentStep} === 3) return; // Don't animate if already delivered
  let progress = 0;
        const duration = 15000; // Animation time
        const interval = 50; 
        const step = interval / duration; 

        function stepAnim() {
          if (progress >= 1) {
            bikeMarker.setLatLng(end);
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage("ARRIVED");
            return;
          }
          // Linear interpolation for movement
          var currentLat = start[0] + (end[0] - start[0]) * progress;
          var currentLng = start[1] + (end[1] - start[1]) * progress;
          bikeMarker.setLatLng([currentLat, currentLng]);
          
          progress += step;
          setTimeout(stepAnim, interval);
        }
        stepAnim();
      }

      // Robust Message Handling for Android and iOS
      const handleMessage = (event) => {
        if (event.data === "START_BIKE") {
          animate();
        }
      };
      document.addEventListener("message", handleMessage);
      window.addEventListener("message", handleMessage);
    </script>
  </body>
</html>
`;

  //hook that creates a persistant reference toa DOM elemnt or component
  const webViewRef = React.useRef(null); // ref send msg to webView

    useEffect(() => {
    if (currentStep === 2 && webViewRef.current) {
      webViewRef.current.postMessage("START_BIKE");
    }
  }, [currentStep]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <WebView
        key={mapKey}
          ref={webViewRef} // tells rect native what to do
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={{ flex: 1 }}
onMessage={(event) => {
if (event.nativeEvent.data === "ARRIVED") {
  setCurrentStep(3);
  
  console.log('Order Delivered!');
}
  }}
          allowFileAccess={true}
  allowUniversalAccessFromFileURLs={true}
  allowFileAccessFromFileURLs={true}
  domStorageEnabled={true}
  mixedContentMode="always"
        />
        <TouchableOpacity
          style={styles.backButton}
        onPress={() => navigation.navigate('Main')}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
 <View style={styles.stepWrapper}>
<Text style={styles.statusTitle}>
  {currentStep === 3 ? "Order Delivered!" : currentStep < 2 ? "Preparing your order..." : "Rider is on the way!"}
</Text>
        <StepIndicator
          customStyles={stepIndicatorStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={4}
          renderStepIndicator={({ position, stepStatus }) => (
            stepStatus === 'finished' ? 
            <Ionicons name="checkmark" size={15} color="#fff" /> : 
            <Text style={{ color: stepStatus === 'current' ? '#BC8A45' : '#aaa' }}>{position + 1}</Text>
          )}
        />
      </View>

      <Text style={styles.sectionHeader}>Address</Text>
          <View style={styles.addressBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="home" size={20} color="#BC8A45" />
            </View>
            <View style={styles.addressTextContent}>
              <Text style={styles.locationTitle}>{locationName || 'Home'}</Text>
              <Text style={styles.addressDesc} numberOfLines={2}>
                {displayAddress || 'Address not provided'}
              </Text>
            </View>
          </View>
          <Text style={styles.sectionHeader}>Order #{id || '300'}</Text>
          <Text style={styles.orderMeta}>
            {orderDate || 'Unable to Fetch'} | {orderTime || 'Unable to Fetch'} | {itemCount || 'NA'} Items
          </Text>
          
          <View style={styles.itemsCard}>
            {items && items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.itemPrice}>₹ {item.price}</Text>
              </View>
            ))}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹ {totalAmount}</Text>
            </View>
          </View>
          </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },

  mapContainer: {
    height: responsiveHeight(40),
    width: '100%',

  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    elevation: 4,
  },
  stepWrapper: {
    backgroundColor: '#FFFFFF',
    marginTop: -30, 
    // borderTopLeftRadius: 35,
    // borderTopRightRadius: 35,
    borderRadius:15,
    paddingTop: 25,
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: 20,
    elevation: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: responsiveWidth(92),
    alignSelf:"center"
  },
    statusTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#BC8A45',
    marginBottom: 15,
    textAlign: 'left',
  },
  sectionHeader: {
    fontSize: responsiveFontSize(2.2), 
    fontWeight: '700',
    color: '#000000',
    marginBottom: responsiveHeight(1.5),
    marginTop:responsiveHeight(2),
    marginLeft:responsiveWidth(6)

  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: responsiveWidth(4),
        width: responsiveWidth(92),
        alignSelf:"center",
  
    elevation: 3,
    shadowColor: '#000',
  
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF9F0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextContent: {
    marginLeft: responsiveWidth(4),
    flex: 1,
  },
  locationTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#000000',
  },
  addressDesc: {
    fontSize: responsiveFontSize(1.6),
    color: '#666666',
    marginTop: 4,
    lineHeight: 18,
  },
  orderMeta: {
    fontSize: responsiveFontSize(1.6),
    color: '#999999',
    marginBottom: 20,
    fontWeight: '500',
    letterSpacing: 0.3,
      marginLeft:responsiveWidth(6)
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    width:responsiveWidth(92),
    alignSelf:"center",
      elevation: 3,
    shadowColor: '#000',
  
  
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    // borderWidth:3
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemName: {
    fontSize: responsiveFontSize(1.8),
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  itemPrice: {
    fontSize: responsiveFontSize(1.8),
    color: '#000000',
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '800',
    color: '#000000',
  },
  totalValue: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '800',
    color: '#BC8A45', 
  },
});

export default TrackOrderscreen;
