import React, { useState, useMemo } from 'react';
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
  StatusBar,
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

const Menuscreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCoarse, setSelectedCoarse] = useState('Standard');

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

  const filteredData = useMemo(() => {
    if (selectedCategory === 'All') return menuData;
    return menuData.filter(
      item =>
        item.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (item.category && item.category === selectedCategory),
    );
  }, [selectedCategory]);

  const handleOpenModal = item => {
    setSelectedItem(item);
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
          <Text style={styles.price}>₹{item.price}</Text>
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
                  size={16}
                  color="#FFF"
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(addToCart(item))}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleOpenModal(item)}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#FFF" />
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
          <Text style={styles.unitPrice}>₹{price}</Text>
        </View>
        {qty > 0 ? (
          <View style={styles.modalCounter}>
            <TouchableOpacity
              style={styles.modalQtyBtn}
              onPress={() => updateUnitQty(unitLabel, -1)}
            >
              <Ionicons name="remove" size={16} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalQtyText}>{qty}</Text>
            <TouchableOpacity
              style={styles.modalQtyBtn}
              onPress={() => updateUnitQty(unitLabel, 1)}
            >
              <Ionicons name="add" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.modalAddBtn}
            onPress={() => updateUnitQty(unitLabel, 1)}
            activeOpacity={0.85}
          >
            <Text style={styles.modalAddText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <View style={styles.leftHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#181725" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Menu</Text>
          </View>
          <View style={styles.rightHeader}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="search-outline" size={22} color="#181725" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color="#181725" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.85}
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
              activeOpacity={0.95}
            >
              <Text style={styles.viewCartQtyText}>{totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'} Added</Text>
              <View style={styles.viewCartRight}>
                <Text style={styles.viewCartText}>View Cart</Text>
                <Ionicons name="basket" size={20} color="#FFF" />
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
              <Text style={styles.modalTitle}>Customize Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#181725" />
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
                <TouchableOpacity style={styles.moreSettingsBtn} activeOpacity={0.8}>
                  <Text style={styles.moreSettingsText}>More Settings</Text>
                  <Ionicons name="chevron-down" size={16} color="#181725" />
                </TouchableOpacity>
              </View>

              <Text style={styles.selectUnitTitle}>Select Coarse</Text>
              <View style={styles.coarseContainer}>
                {['Fine', 'Standard', 'Thick'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.radioRow}
                    onPress={() => setSelectedCoarse(type)}
                    activeOpacity={0.8}
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
              activeOpacity={0.9}
              onPress={() => {
                Object.keys(unitQuantities).forEach(unit => {
                  if (unitQuantities[unit] > 0) {
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
              <Text style={styles.checkoutText}>Add To Basket</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#FFFFFF',
  },
  headerRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop:Platform.OS==='ios'?responsiveHeight(2):responsiveHeight(1.5),
    paddingBottom:responsiveHeight(1.5),
    paddingHorizontal:responsiveWidth(5),
    borderBottomWidth:1,
    borderColor:'#F8F8F8',
  },
  leftHeader:{
    flexDirection:'row',
    alignItems:'center',
  },
  backBtn:{
    width:responsiveWidth(10),
    height:responsiveWidth(10),
    borderRadius:50,
    backgroundColor:'#F8F8F8',
    justifyContent:'center',
    alignItems:'center',
    marginRight:responsiveWidth(3),
  },
  headerText:{
    fontSize:responsiveFontSize(2.5),
    fontFamily:'Poppins-Bold',
    color:'#181725',
  },
  rightHeader:{
    flexDirection:'row',
    alignItems:'center',
  },
  iconBtn:{
    width:responsiveWidth(10),
    height:responsiveWidth(10),
    borderRadius:50,
    backgroundColor:'#F8F8F8',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:responsiveWidth(2.5),
  },
  categoryContainer:{
    height:responsiveHeight(7.5),
    justifyContent:'center',
  },
  list:{
    paddingLeft:responsiveWidth(5),
  },
  listContent:{
    alignItems:'center',
    paddingRight:responsiveWidth(8),
  },
  categoryItem:{
    backgroundColor:'#F8F8F8',
    borderWidth:1,
    borderColor:'#E2E2E2',
    paddingHorizontal:responsiveWidth(4.5),
    marginRight:responsiveWidth(2.5),
    borderRadius:100,
    height:responsiveHeight(4.5),
    justifyContent:'center',
    alignItems:'center',
  },
  activeCategory:{
    backgroundColor:'#BD8D46',
    borderColor:'#BD8D46',
  },
  categoryText:{
    fontSize:responsiveFontSize(1.7),
    fontFamily:'Poppins-SemiBold',
    color:'#7C7C7C',
  },
  activeCategoryText:{
    color:'#FFFFFF',
  },
  verticalListContent:{
    paddingHorizontal:responsiveWidth(5),
    paddingTop:responsiveHeight(1.5),
    paddingBottom:responsiveHeight(15),
  },
  card:{
    flexDirection:'row',
    backgroundColor:'#FFFFFF',
    borderRadius:20,
    padding:responsiveWidth(3),
    marginBottom:responsiveHeight(2),
    elevation:4,
    shadowColor:'#000',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.05,
    shadowRadius:5,
    borderWidth:1,
    borderColor:'#F2F3F2',
  },
  img:{
    width:responsiveWidth(22),
    height:responsiveHeight(12),
    borderRadius:14,
    resizeMode:'contain',
  },
  infoContainer:{
    flex:1,
    marginLeft:responsiveWidth(4),
    justifyContent:'space-between',
    paddingVertical:responsiveHeight(0.1),
  },
  nameWrapper:{
    minHeight:responsiveHeight(5.5),
  },
  name:{
    fontSize:responsiveFontSize(1.6),
    fontFamily:'Poppins-SemiBold',
    color:'#181725',
    lineHeight:responsiveFontSize(2.5),
  },
  price:{
    fontSize:responsiveFontSize(2.1),
    fontFamily:'Poppins-Bold',
    color:'#181725',
  },
  footerContainer:{
    justifyContent:'flex-end',
    alignItems:'center',
    paddingBottom:responsiveHeight(0.5),
  },
  addBtn:{
    backgroundColor:'#BD8D46',
    width:34,
    height:34,
    borderRadius:12,
    justifyContent:'center',
    alignItems:'center',
  },
  counterContainer:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#BD8D46',
    borderRadius:12,
    paddingHorizontal:5,
    height:34,
  },
  qtyBtn:{
    padding:4,
  },
  qtyText:{
    color:'#FFFFFF',
    fontSize:responsiveFontSize(1.7),
    fontFamily:'Poppins-Bold',
    marginHorizontal:8,
  },
  viewCartContainer:{
    position:'absolute',
    bottom:responsiveHeight(2),
    left:responsiveWidth(5),
    right:responsiveWidth(5),
  },
  viewCartButton:{
    backgroundColor:'#BD8D46',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:responsiveWidth(6),
    paddingVertical:responsiveHeight(2),
    borderRadius:20,
    elevation:6,
    shadowColor:'#BD8D46',
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.3,
    shadowRadius:8,
  },
  viewCartQtyText:{
    color:'#FFFFFF',
    fontSize:responsiveFontSize(1.9),
    fontFamily:'Poppins-Bold',
  },
  viewCartRight:{
    flexDirection:'row',
    alignItems:'center',
  },
  viewCartText:{
    color:'#FFFFFF',
    fontSize:responsiveFontSize(2),
    fontFamily:'Poppins-Bold',
    marginRight:6,
  },
  modalOverlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.45)',
    justifyContent:'flex-end',
  },
  modalContent:{
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:28,
    borderTopRightRadius:28,
    padding:responsiveWidth(6),
    maxHeight:responsiveHeight(85),
  },
  modalHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:responsiveHeight(2),
  },
  closeBtn:{
    width:32,
    height:32,
    borderRadius:16,
    backgroundColor:'#F5F5F5',
    justifyContent:'center',
    alignItems:'center',
  },
  modalTitle:{
    fontSize:responsiveFontSize(2.3),
    fontFamily:'Poppins-Bold',
    color:'#181725',
  },
  productTitle:{
    fontSize:responsiveFontSize(2.5),
    fontFamily:'Poppins-Bold',
    color:'#181725',
    marginBottom:10,
  },
  productDesc:{
    fontSize:responsiveFontSize(1.6),
    color:'#7C7C7C',
    lineHeight:22,
    marginBottom:20,
    fontFamily:'Poppins-Regular',
  },
  seeMore:{
    color:'#BD8D46',
    fontFamily:'Poppins-SemiBold',
  },
  selectUnitTitle:{
    fontSize:responsiveFontSize(2),
    color:'#181725',
    fontFamily:'Poppins-Bold',
    marginBottom:15,
  },
  unitItem:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#FDFDFD',
    borderWidth:1,
    borderColor:'#F2F3F2',
    paddingHorizontal:responsiveWidth(4),
    paddingVertical:responsiveHeight(1.5),
    borderRadius:16,
    marginBottom:12,
  },
  unitText:{
    fontSize:responsiveFontSize(1.9),
    fontFamily:'Poppins-Medium',
    color:'#181725',
  },
  unitPrice:{
    fontSize:responsiveFontSize(1.8),
    color:'#BD8D46',
    fontFamily:'Poppins-Bold',
    marginTop:2,
  },
  modalCounter:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#BD8D46',
    borderRadius:12,
    paddingHorizontal:6,
    height:34,
  },
  modalQtyBtn:{
    padding:2,
  },
  modalQtyText:{
    marginHorizontal:12,
    fontSize:16,
    fontFamily:'Poppins-Bold',
    color:'#FFFFFF',
  },
  modalAddBtn:{
    backgroundColor:'#BD8D46',
    paddingHorizontal:18,
    paddingVertical:6,
    borderRadius:12,
  },
  modalAddText:{
    color:'#FFFFFF',
    fontFamily:'Poppins-Bold',
    fontSize:15,
  },
  moreSettingsContainer:{
    marginVertical:15,
  },
  moreSettingsBtn:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#F5F5F5',
    alignSelf:'flex-start',
    paddingHorizontal:15,
    paddingVertical:8,
    borderRadius:20,
  },
  moreSettingsText:{
    fontSize:15,
    color:'#181725',
    fontFamily:'Poppins-Medium',
    marginRight:5,
  },
  coarseContainer:{
    marginBottom:10,
  },
  radioRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:12,
    borderBottomWidth:1,
    borderColor:'#F8F8F8',
  },
  radioText:{
    fontSize:17,
    fontFamily:'Poppins-Medium',
    color:'#181725',
  },
  checkoutBtn:{
    backgroundColor:'#BD8D46',
    borderRadius:20,
    paddingVertical:responsiveHeight(2),
    alignItems:'center',
    marginTop:15,
    elevation:4,
    shadowColor:'#BD8D46',
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.25,
    shadowRadius:6,
  },
  checkoutText:{
    color:'#FFFFFF',
    fontSize:responsiveFontSize(2.1),
    fontFamily:'Poppins-Bold',
  },
});

export default Menuscreen;