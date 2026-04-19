import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const SupportScreen = ({ navigation }) => {
  
  const handleEmail = () => {
    Linking.openURL('mailto:aditya@xstrategyservices.in');
  };

  const handleCall = () => {
    Linking.openURL('tel:9528230119');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="headset" size={45} color="#BD8D46" />
        </View>
        
        <Text style={styles.title}>Support</Text>
        
        <Text style={styles.description}>
          For any support request regards your enquiry please feel free to speak with us at below.
        </Text>

        <TouchableOpacity style={styles.card} onPress={handleEmail}>
          <View style={styles.cardIconBox}>
            <Ionicons name="mail" size={24} color="#BD8D46" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Email</Text>
            <Text style={styles.cardValue}>support@flourbuddy.in</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleCall}>
          <View style={styles.cardIconBox}>
            <Ionicons name="call" size={24} color="#BD8D46" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardLabel}>Call</Text>
            <Text style={styles.cardValue}>+91 9528230119</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    height: responsiveHeight(8),
    marginTop:responsiveHeight(1.2)
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: 'Raleway-Bold',
    color: '#181725',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(8),
    paddingTop: responsiveHeight(6),
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  title: {
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'Raleway-Bold',
    color: '#181725',
    marginBottom: responsiveHeight(2),
  },
  description: {
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
    color: '#7C7C7C',
    lineHeight: 24,
    fontFamily: 'Raleway-Medium',
    marginBottom: responsiveHeight(5),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardIconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    fontFamily: 'Raleway-Medium',
  },
  cardValue: {
    fontSize: responsiveFontSize(2),
    color: '#BD8D46',
    fontFamily: 'Raleway-Bold',
    marginTop: 2,
  },
});

export default SupportScreen;