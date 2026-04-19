import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const Aboutus = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/images/Login.png')} 
            style={styles.logo}
          />
        </View>

        <Text style={styles.brandTitle}>FlourBuddy</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        <View style={styles.contentSection}>
          <Text style={styles.description}>
            Welcome to FlourBuddy, your trusted partner for high-quality, fresh, and nutritious flour. We are dedicated to bringing the traditional goodness of stone-ground flour directly to your doorstep.
          </Text>

          <Text style={styles.subTitle}>Our Mission</Text>
          <Text style={styles.description}>
            Our mission is to promote a healthy lifestyle by providing chemical-free, preservative-free, and freshly milled flours that retain all their natural nutrients and flavors.
          </Text>

          <Text style={styles.subTitle}>Why Choose Us?</Text>
          <Text style={styles.description}>
            • 100% Natural & Fresh{'\n'}
            • Traditional Milling Process{'\n'}
            • Strict Quality Checks{'\n'}
            • Hygienic Packaging{'\n'}
            • Fast Doorstep Delivery
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for a Healthy India</Text>
          <Text style={styles.copyright}>© 2026 FlourBuddy. All rights reserved.</Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: responsiveWidth(6),
    alignItems: 'center',
    paddingTop: responsiveHeight(2),
  },
  imageContainer: {
    marginBottom: responsiveHeight(2),
  },
  logo: {
    width: responsiveWidth(30),
    height: responsiveHeight(12),
    resizeMode: 'contain',
  },
  brandTitle: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'Raleway-Bold',
    color: '#BD8D46',
  },
  version: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    fontFamily: 'Raleway-Medium',
    marginBottom: responsiveHeight(4),
  },
  contentSection: {
    width: '100%',
  },
  subTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Raleway-Bold',
    color: '#181725',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1),
  },
  description: {
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
    lineHeight: 24,
    fontFamily: 'Raleway-Medium',
  },
  footer: {
    marginTop: responsiveHeight(6),
    marginBottom: responsiveHeight(4),
    alignItems: 'center',
  },
  footerText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Raleway-SemiBold',
    color: '#181725',
  },
  copyright: {
    fontSize: responsiveFontSize(1.4),
    color: '#7C7C7C',
    marginTop: responsiveHeight(1),
    fontFamily: 'Raleway-Medium',
  },
});

export default Aboutus;