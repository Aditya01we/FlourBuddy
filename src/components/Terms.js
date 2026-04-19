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

const TermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.lastUpdated}>Last Updated: October 2024</Text>
        
        <Text style={styles.introText}>
          Please read these terms carefully before using our mobile application. 
          Your access to the service is conditioned on your acceptance of and compliance with these terms.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionContent}>
            By accessing and using the FlourBuddy application, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Accounts</Text>
          <Text style={styles.sectionContent}>
            To use certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Ordering & Delivery</Text>
          <Text style={styles.sectionContent}>
            All orders are subject to availability. Delivery times are estimates and may vary based on location, traffic, and weather conditions. We reserve the right to refuse service to anyone.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Pricing & Payments</Text>
          <Text style={styles.sectionContent}>
            Prices for our products are subject to change without notice. We use secure third-party payment gateways and do not store your full credit card details on our servers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
          <Text style={styles.sectionContent}>
            FlourBuddy shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services.
          </Text>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.acceptBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.acceptText}>I Agree</Text>
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
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
  },
  lastUpdated: {
    fontSize: responsiveFontSize(1.6),
    color: '#7C7C7C',
    fontFamily: 'Raleway-Medium',
    marginBottom: responsiveHeight(1),
  },
  introText: {
    fontSize: responsiveFontSize(1.8),
    color: '#181725',
    lineHeight: 24,
    fontFamily: 'Raleway-Regular',
    marginBottom: responsiveHeight(4),
  },
  section: {
    marginBottom: responsiveHeight(3),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Raleway-Bold',
    color: '#181725',
    marginBottom: responsiveHeight(1),
  },
  sectionContent: {
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
    lineHeight: 22,
    fontFamily: 'Raleway-Medium',
  },
  footerSpacer: {
    height: responsiveHeight(12),
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: responsiveWidth(5),
    borderTopWidth: 1,
    borderTopColor: '#F2F3F2',
  },
  acceptBtn: {
    backgroundColor: '#BD8D46',
    height: responsiveHeight(7),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Raleway-Bold',
  },
});

export default TermsScreen;