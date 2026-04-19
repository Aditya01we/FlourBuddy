import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Orderscreen = ({navigation}) => {
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      const data = await AsyncStorage.getItem('myOrders');
      console.log("SUCCESS: Found " + data.length + " orders in storage.");
        console.log("ORDER DATA:", data);
      if (data) {
        setOrders(JSON.parse(data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderOrderItem = ({ item }) => (
   <TouchableOpacity 
      style={styles.orderCard} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('OrderDetailscreen', { orderDetails: item })}
    >
      <View style={styles.cardHeader}>
        <Image
          source={require('../../assets/images/david.png')}
          style={styles.shopImage}
        />
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.shopName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color="#BC8A45" />
            <Text style={styles.locationText}>{item.shopAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.label}>Order</Text>
        <Text style={styles.value}>#{item.id}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{item.date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Product</Text>
        <Text style={styles.value}>{item.cartLength} Items</Text>
      </View>
 <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.priceText}>₹ {item.totalAmount}</Text>
      </View>
  
    </TouchableOpacity>

    
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#E2E2E2" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Orderscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    color: '#181725',
    fontFamily: 'Raleway-Bold',
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(4),
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#F2F3F2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F2F3F2',
  },
  shopInfo: {
    marginLeft: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181725',
    fontFamily: 'Raleway-Bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#7C7C7C',
    marginLeft: 4,
    fontFamily: 'Raleway-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F3F2',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#7C7C7C',
    fontFamily: 'Raleway-Medium',
  },
  value: {
    fontSize: 14,
    color: '#181725',
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBadge: {
    backgroundColor: '#F2FFF3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181725',
    fontFamily: 'Raleway-Bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(20),
  },
  emptyText: {
    marginTop: 10,
    color: '#7C7C7C',
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
  },

});