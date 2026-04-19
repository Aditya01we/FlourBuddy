import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Modal
} from 'react-native';
import React, { useState, useCallback } from 'react'; 
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Accountscreen = ({navigation}) => {

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setLogoutModal(false);
      navigation.replace('Loginscreen');
    } catch (error) {
      console.log(error);
    }
  };

    const [userData, setUserData] = useState({
    name: '',
    mobile: '',
    photo: null,
  });
const [logoutModal, setLogoutModal] = useState(false);
    const getProfileData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userProfile');
      if (storedData) {
        const Data = JSON.parse(storedData);
        setUserData({
name: Data.name,
        mobile: Data.mobile || Data.email, 
        photo: Data.photo || null,
        });
      }
    } catch (error) {
      console.log("Error fetching profile data:", error);
    }
  };

    useFocusEffect(
    useCallback(() => {
      getProfileData();
    }, [])
  );

  return (

    
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

    
      <View style={styles.profileSection}>

       <Image 
  source={userData.photo ? { uri: userData.photo } : require('../../assets/images/profile.png')} 
  style={styles.profileImage} 
/>
        <View style={styles.profileDetails}>
          <View style={styles.nameRow}>
               <Text style={styles.userName}>{userData.name || 'Update your profile'}</Text>

          </View>
                  <Text style={styles.userNumber}>{userData.mobile}</Text>
        </View>
      </View>
      
      
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profilescreen")}
        >
          <Image
            source={require('../../assets/images/profile copy.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Profile</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Address")}
        >
          <Image
            source={require('../../assets/images/address.png')}
            style={styles.image}
          />
          <Text style={styles.label}>My Addresses</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>

     <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Support")}
        >
          <Image
            source={require('../../assets/images/support.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Support</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>

  <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Aboutus")}
        >
          <Image
            source={require('../../assets/images/about-us.png')}
            style={styles.image}
          />
          <Text style={styles.label}>About us</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.button}
         onPress={() => navigation.navigate("Sharescreen")}
        >
          <Image
            source={require('../../assets/images/share.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Share</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>

        
        <TouchableOpacity style={styles.button}
         onPress={() => navigation.navigate("Terms")}
        >
          <Image
            source={require('../../assets/images/terms.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setLogoutModal(true)}
        >
          <Image
            source={require('../../assets/images/logout.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} style={styles.icon} />
        </TouchableOpacity>
   <Modal transparent visible={logoutModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>

            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleLogout}
              >
                <Text style={styles.confirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Accountscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(4),
    paddingBottom: responsiveHeight(2),
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F2',
  },
  profileImage: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    backgroundColor: '#F2F3F2', 
  },
  profileDetails: {
    marginLeft: responsiveWidth(4),
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Raleway-Bold',
    color: '#181725',
  },
  userNumber: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Raleway-Medium',
    color: '#7C7C7C',
    marginTop: 2,
  },
   content: {
    marginTop: responsiveHeight(3.6),
  },

  button: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(6),
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    borderRadius: 15,
  },

  image: {
    height: 40,
    width: 40,
    marginTop: responsiveHeight(0.8),
    marginLeft: responsiveWidth(1.8),
  },

  label: {
    fontSize: responsiveFontSize(2.2),
    margin: responsiveHeight(1.7),
    fontFamily: "Raleway-SemiBold"
  },

  icon: {
    marginLeft: 'auto',
    marginRight: responsiveWidth(4),
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },

  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },

  modalText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: '#555',
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: responsiveHeight(3),
  },

  cancelBtn: {
    backgroundColor: '#ccc',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  confirmBtn: {
    backgroundColor: '#BD8D46',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },

  cancelText: {
    color: '#000',
    fontWeight: 'bold',
  },

  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});