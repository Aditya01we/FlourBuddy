import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Notificationscreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from storage whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = async () => {
    try {
      const storedNotifs = await AsyncStorage.getItem('userNotifications');
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  const handeleback = () => {
    navigation.navigate("Main");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notification_cards} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
      
        <Image 
          source={require('../../assets/images/notification.png')} 
          style={styles.img} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.main_text}>{item.title}</Text>
        <Text style={styles.sub_text}>{item.body || item.message}</Text>
        <Text style={styles.time}>{item.time || 'Just now'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handeleback}>
          <Ionicons name="chevron-back" size={26} color="#000" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.label}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#E2E2E2" />
            <Text style={styles.emptyText}>No new notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Notificationscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon:{
    marginTop:responsiveHeight(0.8)
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: responsiveHeight(4), 
    paddingHorizontal: responsiveWidth(5),
  },
  label: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'Raleway-SemiBold',
    //     width: responsiveWidth(12),
    // height: responsiveWidth(12),
  
    // marginTop: responsiveHeight(6),
    marginLeft: responsiveWidth(2),
      // borderRadius: responsiveWidth(6),
  },

  cards: {
    gap: responsiveHeight(2),
    marginTop: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(5),

  },

 notification_cards: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: responsiveWidth(4),
    // width: responsiveWidth(12),
    // height: responsiveWidth(12),
    // borderRadius: responsiveWidth(6),
    
    padding: responsiveWidth(4),
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor:"#333",
    elevation:2
  },

  imageContainer: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(6),
 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(4),
  },

  img: {
    width: '80%',
    height: '80%',
  },

  textContainer: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  main_text: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: responsiveFontSize(2.1),
    color: '#000',
  },

  sub_text: {
    fontFamily: 'Raleway',
    fontSize: responsiveFontSize(1.7),
    color: '#7E7E7E', 
    marginTop: responsiveHeight(0.5),
      // borderRadius: responsiveWidth(6),
    lineHeight: responsiveHeight(2.2),
  },

  time: {
    fontSize: responsiveFontSize(1.5),
    color: '#A1A1A1',
    fontFamily: 'Raleway-Medium',
    color:"#333"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(20),
  },
  emptyText: {
    fontFamily: 'Raleway-Medium',
    fontSize: responsiveFontSize(2),
    color: '#A1A1A1',
    marginTop: 10,
  },
});