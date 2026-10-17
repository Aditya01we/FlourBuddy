import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loginscreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '95489986202-0g49t8qdf2pn4cr1tf2vplfafnot0cpj.apps.googleusercontent.com',
      offlineAccess: true,
    });
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      const user = await AsyncStorage.getItem('userProfile');
      const mobileUser = await AsyncStorage.getItem('userMobile');
      if (user || mobileUser) {
        navigation.replace('Main');
      }
    } catch (e) {
      console.log('Login Error', e);
    }
  };

  const handleSendOTP = async () => {
    if (mobile.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number',
      );
      return;
    }
    setLoading(true);
    try {
      const formattedMobile = `+91${mobile}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedMobile);

      await AsyncStorage.setItem('userMobile', mobile);
      navigation.navigate('OTPscreen', { confirmation });
    } catch (error) {
      console.log('Phone Auth Error:', error);
      Alert.alert(
        'Login Error',
        error.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut().catch(() => {});
      const response = await GoogleSignin.signIn();
      const idToken =
        response.idToken || (response.data && response.data.idToken);

      if (!idToken) {
        Alert.alert('Login Error', 'No ID Token found.');
        return;
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(googleCredential);

      const userData = {
        customerId: user.user.uid,
        name: user.user.displayName || '',
        email: user.user.email || '',
        photo: user.user.photoURL || '',
        phone: user.user.phoneNumber || '',
        address: '',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection('customers')
        .doc(user.user.uid)
        .set(userData, { merge: true });

      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
      if (userData.phone) {
        await AsyncStorage.setItem('userMobile', userData.phone);
      }

      navigation.replace('Main');
    } catch (error) {
      console.log(error);
      Alert.alert('Google Login Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/Login.png')}
                style={styles.logo}
              />
              <TouchableOpacity onPress={() => navigation.replace('Main')}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.titleText}>Welcome Back 👋</Text>
              <Text style={styles.subtitle}>
                Login to continue shopping fresh groceries
              </Text>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Mobile Number"
                    placeholderTextColor="#999"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.termsText}>
                  By continuing you agree to our{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleSendOTP}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginBtnText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.social}>
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={googleLogin}
                activeOpacity={0.85}
              >
                <AntDesign name="google" size={22} color="#fff" />
                <Text style={styles.googleText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  logo: {
    width: responsiveWidth(40),
    height: responsiveHeight(7),
    resizeMode: 'contain',
  },
  skipText: {
    fontSize: responsiveFontSize(1.9),
    color: '#7C7C7C',
    fontWeight: '700',
  },
  content: {
    marginTop: responsiveHeight(5),
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  titleText: {
    fontSize: responsiveFontSize(3.2),
    color: '#181725',
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    marginTop: responsiveHeight(1),
    color: '#7C7C7C',
    fontSize: responsiveFontSize(1.8),
    lineHeight: 24,
  },
  inputSection: {
    marginTop: responsiveHeight(5),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
    marginBottom: responsiveHeight(1.5),
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: responsiveHeight(7.5),
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    paddingHorizontal: responsiveWidth(4),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  countryCode: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: '700',
    color: '#181725',
    marginRight: responsiveWidth(3),
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    color: '#181725',
    fontWeight: '600',
  },
  footer: {
    marginTop: responsiveHeight(8),
    alignItems: 'center',
  },
  termsText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.45),
    color: '#7C7C7C',
    lineHeight: 22,
    marginBottom: responsiveHeight(3),
  },
  termsLink: {
    color: '#BC8A45',
    fontWeight: '700',
  },
  loginBtn: {
    height: responsiveHeight(7.2),
    width: '100%',
    backgroundColor: '#BC8A45',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#BC8A45',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  social: {
    marginTop: responsiveHeight(5),
    alignItems: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    height: responsiveHeight(7),
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#DB4437',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  googleText: {
    color: '#fff',
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
  },
});
