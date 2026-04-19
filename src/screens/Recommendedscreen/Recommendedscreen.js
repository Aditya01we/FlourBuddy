import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/cartSlice';
import menuData from '../../components/menu';

const Recommendedscreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);



  const renderProduct = ({ item }) => {
    // Only render items with a valid price
    if (!item.price) return null;

    const cartItem = cartItems.find((i) => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.gridCard}>
        <Image source={item.image} style={styles.productImg} />
        
        <View style={styles.textContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            
            {quantity > 0 ? (
              <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => dispatch(removeFromCart(item))}>
                  <Ionicons name="remove-circle" size={24} color="#BD8D46" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={() => dispatch(addToCart(item))}>
                  <Ionicons name="add-circle" size={24} color="#BD8D46" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => dispatch(addToCart(item))}
              >
                <Ionicons name="add-sharp" size={18} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommended for you</Text>
      </View>

  
      <FlatList
          data={menuData.slice(1, 4)}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.rowWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

    
 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(5),
  },
  backBtn: {
    marginRight: responsiveWidth(3),
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveHeight(12),
  },
  rowWrapper: {
    justifyContent: 'space-between',
  },
  gridCard: {
    width: responsiveWidth(44),
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#F2F3F2',
    // Shadow for iOS/Android
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  productImg: {
    width: '100%',
    height: responsiveHeight(15),
    resizeMode: 'contain',
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 8,
  },
  productName: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'Raleway-SemiBold',
    color: '#181725',
    height: responsiveHeight(4.5), 
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Poppins-Bold',
    color: '#181725',
  },
  addButton: {
    backgroundColor: '#BD8D46',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Poppins-Bold',
    marginHorizontal: 8,
    color: '#181725',
  },
 
});

export default Recommendedscreen;