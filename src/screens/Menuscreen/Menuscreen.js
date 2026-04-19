import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
  Modal,
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

import menuData from '../../components/menu';

const Menuscreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCoarse, setSelectedCoarse] = useState('Standard');

  // Local state to manage quantities for different units in the modal independently
  const [unitQuantities, setUnitQuantities] = useState({
    '500 gm': 0,
    '1 kg': 0,
    '2 kg': 0,
  });

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const categories = useMemo(() => {
    return ['All', 'Wheat Flour', 'Millets Flour', 'Besan', 'Spices'];
  }, []);

  const filteredData = useMemo(() =>
     {
    if (selectedCategory === 'All')
       return menuData;
    return menuData.filter(
      item =>
        item.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (item.category && item.category === selectedCategory),
    );
  }, [selectedCategory]);

  const handleOpenModal = item => {
    setSelectedItem(item);
    // Reset modal local quantities when opening for a new item
    setUnitQuantities({ '500 gm': 0, '1 kg': 0, '2 kg': 0 });
    setModalVisible(true);
  };

  const updateUnitQty = (unit, delta) => {
    setUnitQuantities(prev => ({
      ...prev,
      [unit]: Math.max(0, prev[unit] + delta),
    }));
  };

  const renderProduct = ({ item }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.img} />
        <View style={styles.infoContainer}>
          <View style={styles.nameWrapper}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
          <Text style={styles.price}>₹ {item.price}</Text>
        </View>

        <View style={styles.footerContainer}>
          {quantity > 0 ? (
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(removeFromCart(item))}
              >
                <Ionicons
                  name="remove"
                  size={responsiveFontSize(2)}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(addToCart(item))}
              >
                <Ionicons
                  name="add"
                  size={responsiveFontSize(2)}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleOpenModal(item)}
            >
              <Text style={styles.addText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderModalUnit = (unitLabel, price) => {
    const qty = unitQuantities[unitLabel];

    return (
      <View style={styles.unitItem}>
        <View>
          <Text style={styles.unitText}>{unitLabel}</Text>
          <Text style={styles.unitPrice}>₹ {price}</Text>
        </View>
        {qty > 0 ? (
          <View style={styles.modalCounter}>
            <TouchableOpacity
              style={styles.modalQtyBtn}
              onPress={() => updateUnitQty(unitLabel, -1)}
            >
              <Ionicons name="remove" size={18} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalQtyText}>{qty}</Text>
            <TouchableOpacity
              style={styles.modalQtyBtn}
              onPress={() => updateUnitQty(unitLabel, 1)}
            >
              <Ionicons name="add" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.modalAddBtn}
            onPress={() => updateUnitQty(unitLabel, 1)}
          >
            <Text style={styles.modalAddText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Menu</Text>
          </View>
          <View style={styles.rightHeader}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="options-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: responsiveHeight(8) }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={{ alignItems: 'center', paddingRight: 20 }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.verticalListContent}
          showsVerticalScrollIndicator={false}
        />

        {totalQuantity > 0 && (
          <View style={styles.viewCartContainer}>
            <TouchableOpacity
              style={styles.viewCartButton}
              onPress={() => navigation.navigate('Viewcartscreen')}
            >
              <Text style={styles.viewCartQtyText}>{totalQuantity} Items</Text>
              <View style={styles.viewCartRight}>
                <Text style={styles.viewCartText}>View Cart</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && selectedItem !== null}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Option</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.productTitle}>{selectedItem?.name}</Text>
              <Text style={styles.productDesc} numberOfLines={3}>
                Multigrain flour contain following items: Wheat (68%), Jowar
                (6%), Bajra (6%), Maize (5%), Ragi (5%), Chana Dal (5%) and
                So... <Text style={styles.seeMore}>See more</Text>
              </Text>

              <Text style={styles.selectUnitTitle}>Select Unit</Text>
              {renderModalUnit('500 gm', 400)}
              {renderModalUnit('1 kg', 800)}
              {renderModalUnit('2 kg', 1500)}

              <View style={styles.moreSettingsContainer}>
                <TouchableOpacity style={styles.moreSettingsBtn}>
                  <Text style={styles.moreSettingsText}>More Settings</Text>
                  <Ionicons name="chevron-down" size={16} color="#000" />
                </TouchableOpacity>
              </View>

              <Text style={styles.selectUnitTitle}>Select Coarse</Text>
              <View style={styles.coarseContainer}>
                {['Fine', 'Standard', 'Thick'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.radioRow}
                    onPress={() => setSelectedCoarse(type)}
                  >
                    <Text style={styles.radioText}>{type}</Text>
                    <Ionicons
                      name={
                        selectedCoarse === type
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={20}
                      color={selectedCoarse === type ? '#BD8D46' : '#7C7C7C'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => {
                // Dispatch all units that have qty > 0 to Redux
                Object.keys(unitQuantities).forEach(unit => {
                  if (unitQuantities[unit] > 0) {
                    // Standard way: include unit/coarse in the object for the cart
                    dispatch(
                      addToCart({
                        ...selectedItem,
                        unit,
                        coarse: selectedCoarse,
                        quantity: unitQuantities[unit],
                      }),
                    );
                  }
                });
                setModalVisible(false);
              }}
            >
              <Text style={styles.checkoutText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(5),
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'Raleway-SemiBold',
    marginLeft: responsiveWidth(2),
    color: '#000',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: responsiveWidth(4),
  },
  list: {
    marginTop: responsiveHeight(1),
    paddingLeft: responsiveWidth(5),
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    paddingHorizontal: responsiveWidth(5),
    marginRight: responsiveWidth(3),
    borderRadius: responsiveWidth(10),
    height: responsiveHeight(4.5),
    justifyContent: 'center',
  },
  activeCategory: {
    backgroundColor: '#BD8D46',
    borderColor: '#BD8D46',
  },
  categoryText: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'Raleway-Medium',
    color: '#7C7C7C',
  },
  activeCategoryText: {
    color: '#fff',
  },
  verticalListContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(15),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },
    borderWidth:0.2
    
  },
  img: {
    width: responsiveWidth(20),
    height: responsiveHeight(12),
    //     backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#E2E2E2',
    // paddingHorizontal: responsiveWidth(5),
    // marginRight: responsiveWidth(3),
    // borderRadius: responsiveWidth(10),
    // height: responsiveHeight(4.5),
    // justifyContent: 'center',
    borderRadius: responsiveWidth(2),
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    marginLeft: responsiveWidth(4),
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(0.5),
  },
  nameWrapper: {
    minHeight: responsiveHeight(5.5),
  },
  name: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'Raleway-SemiBold',
    color: '#181725',
    lineHeight: responsiveFontSize(2.6),
  },
  price: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Poppins-Bold',
    color: '#181725',
  },
  footerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: responsiveHeight(0.5),
  },
  addBtn: {
    backgroundColor: '#BD8D46',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1),
        // paddingHorizontal: responsiveWidth(5),
    // marginRight: responsiveWidth(3),
    // borderRadius: responsiveWidth(10),
    borderRadius: responsiveWidth(2),
    minWidth: responsiveWidth(25),
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BD8D46',
    borderRadius: responsiveWidth(2),
    
    paddingHorizontal: responsiveWidth(1),
    height: responsiveHeight(4.5),
    minWidth: responsiveWidth(25),
    justifyContent: 'space-between',
  },
  qtyBtn: {
    padding: responsiveWidth(1),
  },
  qtyText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  viewCartContainer: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
  },
  viewCartButton: {
    backgroundColor: '#BD8D46',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
        // paddingHorizontal: responsiveWidth(5),
    // marginRight: responsiveWidth(3),
    // borderRadius: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveWidth(3),
  },
  viewCartQtyText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
  viewCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: responsiveWidth(6),
    maxHeight: responsiveHeight(85),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

        // paddingHorizontal: responsiveWidth(5),
    // marginRight: responsiveWidth(3),
    // borderRadius: responsiveWidth(10),
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  productTitle: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginBottom: 10,
  },
  productDesc: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    lineHeight: 20,
    marginBottom: 15,
  },
  seeMore: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectUnitTitle: {
    fontSize: responsiveFontSize(2),
    color: '#BD8D46',
    fontFamily: 'Raleway-Bold',
    marginBottom: 15,
  },
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  unitText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
  },
  unitPrice: {
    fontSize: responsiveFontSize(1.8),
    color: '#BD8D46',
    fontWeight: 'bold',
  },
  modalCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 8,
    padding: 5,
  },
  modalQtyBtn: {
    padding: 5,
  },
  modalQtyText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalAddBtn: {
    backgroundColor: '#BD8D46',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  modalAddText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreSettingsContainer: {
    marginBottom: 20,
  },
  moreSettingsBtn: {
    flexDirection: 'row',
        // paddingHorizontal: responsiveWidth(5),
    // marginRight: responsiveWidth(3),
    // borderRadius: responsiveWidth(10),
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moreSettingsText: {
    fontSize: 14,
    color: '#000',
    marginRight: 5,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  radioText: {
    fontSize: 16,
    color: '#000',
  },
  checkoutBtn: {
    backgroundColor: '#BD8D46',
    borderRadius: 12,
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: {
    

    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Raleway-Bold',
  },
});

export default Menuscreen;
