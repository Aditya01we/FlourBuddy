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
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loginscreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
if (mobile.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // Stores the mobile number to keep the session
      await AsyncStorage.setItem('userMobile', mobile); 
      // Replace ensures user cannot go back to login screen with back button
      navigation.navigate('OTPscreen'); 
    } catch (error) {
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

// used to INITIALIZE the Google SIgn IN
  useEffect(() => {
    GoogleSignin.configure({ //connects app with google
      webClientId:
        '17065530335-8vs43mjueldt8er283p9m5748kld04o9.apps.googleusercontent.com',  //required for getting id token
     offlineAccess: true,
    });

    checkUserLogin();  // check for loggedin user
  }, []);

  const checkUserLogin = async() => {
    try{
      const user = await AsyncStorage.getItem('user');
const mobileUser = await AsyncStorage.getItem('userMobile');
      if(user || mobileUser){
        console.log('user already loggedin');
        navigation.navigate('Main')  // if user is already loggedin move to home screen
      }
    }catch (e){
      console.log("Login error", e)
    }
  }

const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
     await GoogleSignin.signOut().catch(() => {});
    
    //open the popus to choose mail
    const response = await GoogleSignin.signIn();
      
    // check id tkon under response.data and prrof that user logged in
    const idToken = response.idToken || (response.data && response.data.idToken);

    if (!idToken) {
      console.log("Full Response:", response); 
      Alert.alert('Login Error', 'No ID Token found.');
      return;
    }
// convert google token into firbase credentails
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    //loggedin user into firebase
    const user = await auth().signInWithCredential(googleCredential);

const userData = {
  name: user.user.displayName,
  email: user.user.email,
  photo: user.user.photoURL,
  uid: user.user.uid,
  mobile: user.user.phoneNumber || '', // Initialize mobile if available
};
    console.log('Logged In User:', userData);
    
    await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
await AsyncStorage.setItem('userMobile', userData.mobile);
    navigation.navigate('Main');

  } catch (error) {
    console.log('Google Login Detail Error:', error);
    Alert.alert('Login Error', error.message);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
              <TouchableOpacity
              onPress={() => navigation.replace('Main')}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.titleText}>
                Login to access amazing features
              </Text>

              <View style={styles.inputSection}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder=" "
                    placeholderTextColor="#7C7C7C"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="number-pad"
                    maxLength={10}
                    autoFocus={true}
                  />
                </View>
                <View style={styles.underline} />
              </View>

              <View style={styles.footer}>
                <Text style={styles.termsText}>
                  By going forward you accept{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  <Text style={styles.loginBtnText}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.social}>
              <TouchableOpacity style={styles.googleBtn} onPress={googleLogin}>
                <AntDesign name="google" size={20} color="#fff" />
                <Text style={styles.googleText}>
                  Continue with Google
                </Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    height: responsiveHeight(10),
  },
  logo: {
    width: responsiveWidth(35),
    height: responsiveHeight(6),
    resizeMode: 'contain',
  },
  skipText: {
    fontSize: responsiveFontSize(2),
    color: '#7C7C7C',
    fontFamily: 'Raleway-Medium',
  },
  content: {
    marginTop: responsiveHeight(4),
  },
  titleText: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: '600',
    color: '#181725',
    marginBottom: responsiveHeight(6),
    fontFamily: 'Raleway-Bold',
  },
  inputSection: {
    marginBottom: responsiveHeight(2),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
    marginBottom: responsiveHeight(1),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: responsiveHeight(4),
  },
  countryCode: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '500',
    color: '#181725',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(2.2),
    color: '#181725',
    padding: 0,
    letterSpacing: 1,
  },
  underline: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginTop: 8,
  },
  footer: {
    marginTop: responsiveHeight(15),
    alignItems: 'center',
  },
  termsText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.4),
    color: '#7C7C7C',
    marginBottom: responsiveHeight(2),
  },
  termsLink: {
    color: '#BC8A45',
    fontWeight: '600',
  },
  loginBtn: {
    height: responsiveHeight(7),
    width: '100%',
    backgroundColor: '#BC8A45',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
  },
  social: {
    marginTop: responsiveHeight(6),
    alignItems: 'center',
  },

  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  googleText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway-SemiBold',
  },
});