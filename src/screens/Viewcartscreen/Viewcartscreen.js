import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/cartSlice';

const Viewcartscreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const [orderType, setOrderType] = useState('Delivery');
  const [couponCode, setCouponCode] = useState('CBFLOUR-10');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');


  const PlaceOrder = () => {
    navigation.navigate("CartAddressscreen")
  }

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const deliveryCharge = orderType === 'Delivery' ? 0 : 0;
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
    
        <Text style={styles.sectionTitle}>Select Option</Text>
        <View style={styles.toggleContainer}>
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
        </View>

        
        <Text style={styles.sectionTitle}>Order List</Text>
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

    
        <Text style={styles.sectionTitle}>Bill Details</Text>
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

        {/* <Text style={styles.sectionTitle}>Payment Method</Text>
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
        <TouchableOpacity style={styles.placeOrderBtn} onPress={PlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
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

export default Viewcartscreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
     backgroundColor: '#FDFDFD' 
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
  sectionTitle: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1.5),
  },

  toggleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between'
   },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '48%',
    padding: responsiveHeight(1.8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  activeToggle: {
     borderColor: '#BD8D46' 
    },
  toggleText: {
    marginLeft: 10,
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
  },
  activeToggleText: {
    
    color: '#000',
    
    fontWeight: 'bold'
   },

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
    
    
    marginLeft: responsiveWidth(4) },
  itemHeader: {
     flexDirection: 'row', 
     justifyContent: 'space-between'
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
     fontWeight: 'bold' 
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
     backgroundColor: '#FFF' 
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
     fontWeight: 'bold'
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
     fontWeight: '500' 
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
     color: '#7C7C7C'
     },
  billValue: { 
    fontSize: 15,
     color: '#000', 
     fontWeight: '600' 
    },
  discountText: { 
    fontSize: 15, 
    color: '#4CAF50', 
    fontWeight: 'bold'
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
      fontWeight: 'bold'
     },
  totalValue: {      fontSize: 17, 
     color: '#000',
      fontWeight: 'bold'},

  paymentContainer: {
     marginBottom: 20
     },
  payOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
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
     fontWeight: 'bold'
   },
  priceContainer: {
     flexDirection: 'row',
      alignItems: 'center'
     },
  btnPrice: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 5 
  },
});
