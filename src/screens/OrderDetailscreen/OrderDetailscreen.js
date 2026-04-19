import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const OrderDetailscreen = ({ navigation, route }) => {
  const { orderDetails } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={responsiveFontSize(3)} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Delivered to</Text>
        <View style={styles.addressCard}>
          <View style={styles.iconCircle}>
            <Ionicons 
              name={orderDetails.deliveryLocation === 'Work' ? "briefcase" : "home"} 
              size={responsiveFontSize(2.2)} 
              color="#BC8A45" 
            />
          </View>
          <View style={styles.addressTextWrapper}>
            <Text style={styles.locationName}>{orderDetails.deliveryLocation || 'Home'}</Text>
            <Text style={styles.fullAddress}>{orderDetails.fullAddress}</Text>
          </View>
        </View>

        <View style={styles.orderMetaRow}>
          <Text style={styles.orderIdText}>Order #{orderDetails.id}</Text>
          <Text style={styles.orderMetaDetails}>
            {orderDetails.date} | {orderDetails.cartLength} Items
          </Text>
        </View>

        <View style={styles.itemsCard}>
          {orderDetails.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.name}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Payment Info</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Items total</Text>
            <Text style={styles.paymentValue}>₹{orderDetails.subtotal}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Discount</Text>
            <Text style={[styles.paymentValue, {color: '#4CAF50'}]}>
              - ₹{orderDetails.discount || 0}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Taxes</Text>
            <Text style={styles.paymentValue}>₹{orderDetails.tax || 0}</Text>
          </View>
          
          <View style={styles.smallDivider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{orderDetails.totalAmount}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.trackingCard}>
          <View style={styles.trackRow}>
            <Ionicons name="checkmark-circle" size={responsiveFontSize(2.5)} color="#4CAF50" />
            <Text style={styles.trackText}>{orderDetails.status || 'Delivered Successfully'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.trackOrderBtn}
          onPress={() => navigation.navigate('TrackOrderscreen', {
             userLat: orderDetails.userLat,
             userLng: orderDetails.userLng,
             displayAddress: orderDetails.fullAddress,
             locationName: orderDetails.deliveryLocation,
             id: orderDetails.id,
             orderDate: orderDetails.date,
             orderTime: orderDetails.orderTime || 'N/A',
             itemCount: orderDetails.cartLength,
             items: orderDetails.items,
             totalAmount: orderDetails.totalAmount,
             status: orderDetails.status
          })}
        >
          <Text style={styles.trackOrderBtnText}>Track Order Status</Text>
          <Ionicons name="map-outline" size={responsiveFontSize(2.2)} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#181725',
    marginLeft: responsiveWidth(2),
    fontFamily:"Raleway-SemiBold"
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: '#181725',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1.5),
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: responsiveWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  iconCircle: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: '#FDF7EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextWrapper: {
    marginLeft: responsiveWidth(4),
    flex: 1,
  },
  locationName: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#181725',
      fontFamily:"Raleway-SemiBold"
  },
  fullAddress: {
    fontSize: responsiveFontSize(1.4),
    color: '#7C7C7C',
    marginTop: 2,
  },
  orderMetaRow: {
    marginTop: responsiveHeight(3),
  },
  orderIdText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#181725',
  },
  orderMetaDetails: {
    fontSize: responsiveFontSize(1.4),
    color: '#7C7C7C',
    marginTop: 4,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: responsiveWidth(4),
    marginTop: responsiveHeight(1.5),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  itemRow: {
    marginBottom: responsiveHeight(1),
  },
  itemName: {
    fontSize: responsiveFontSize(1.9),
    color: '#181725',
    fontWeight: '500', 
     fontFamily:"Raleway-SemiBold"
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: responsiveWidth(4),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1.5),
  },
  paymentLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
      fontFamily:"Raleway-SemiBold"
  },
  paymentValue: {
    fontSize: responsiveFontSize(1.7),
    color: '#181725',
    fontWeight: '500',
      fontFamily:"Raleway-SemiBold"
  },
  smallDivider: {
    height: 1,
    backgroundColor: '#F2F3F2',
    marginVertical: responsiveHeight(1),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1),
  },
  grandTotalLabel: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#181725',
      fontFamily:"Raleway-SemiBold"
  },
  grandTotalValue: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#181725',
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: responsiveWidth(4),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackText: {
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(1.7),
    color: '#4CAF50',
    fontWeight: '600',
      fontFamily:"Raleway-SemiBold"
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: responsiveWidth(4),
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackText: {
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    fontFamily: "Raleway-SemiBold"
  },
  trackOrderBtn: {
    backgroundColor: '#BC8A45',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
    borderRadius: 15,
    marginTop: responsiveHeight(4),
    shadowColor: '#BC8A45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  trackOrderBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    marginRight: responsiveWidth(3),
    fontFamily: "Raleway-Bold"
  },
});

export default OrderDetailscreen;