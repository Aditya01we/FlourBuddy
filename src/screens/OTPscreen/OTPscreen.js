import React, { useState, useEffect, useRef } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import AntDesign from 'react-native-vector-icons/AntDesign';

import NotificationServices from '../../services/NotificationServices';

const OTPscreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const [validCode, setValidCode] = useState(null);

  const [loading, setLoading] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    handleSendNotification();
  }, []);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];

    newOtp[index] = text;

    setOtp(newOtp);

    if (text.length !== 0 && index < 3) {
      inputRefs[index + 1].current.focus();
    } else if (text.length !== 0 && index === 3) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSendNotification = async () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setValidCode(randomOtp);

    await NotificationServices.requestPermission();

    await NotificationServices.showNotification(
      'Verification Code',
      `Your OTP is: ${randomOtp}`,
    );
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp !== validCode) {
      Alert.alert('Invalid OTP', 'Please enter correct OTP');

      setOtp(['', '', '', '']);

      inputRefs[0].current.focus();

      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      Alert.alert('Success', 'OTP Verified Successfully');

      navigation.replace('Main');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="#181725" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.titleText}>OTP Verification</Text>

        <Text style={styles.subText}>
          Enter the 4-digit verification code sent to your mobile number
        </Text>

        <View style={styles.mobileRow}>
          <Text style={styles.mobileText}>+91-9876543210</Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={[
                styles.otpInput,
                {
                  borderColor: digit ? '#BC8A45' : '#ECECEC',
                },
              ]}
              value={digit}
              onChangeText={text => handleChangeText(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor="#BC8A45"
              placeholder="•"
              placeholderTextColor="#CFCFCF"
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleSendNotification}
        >
          <Text style={styles.resendText}>Didn’t receive code?</Text>

          <Text style={styles.resendLink}> Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPscreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(4),
  },

  container: {
    flex: 1,

    paddingHorizontal: responsiveWidth(6),

    marginTop: responsiveHeight(5),
  },

  titleText: {
    fontSize: responsiveFontSize(3.3),

    fontWeight: '800',

    color: '#181725',
  },

  subText: {
    marginTop: responsiveHeight(1.5),

    fontSize: responsiveFontSize(1.75),

    color: '#7C7C7C',

    lineHeight: 24,
  },

  mobileRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: responsiveHeight(2),
  },

  mobileText: {
    fontSize: responsiveFontSize(1.8),

    color: '#181725',

    fontWeight: '700',
  },

  changeLink: {
    marginLeft: responsiveWidth(3),

    fontSize: responsiveFontSize(1.7),

    color: '#BC8A45',

    fontWeight: '700',
  },

  otpRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: responsiveHeight(7),
  },

  otpInput: {
    width: responsiveWidth(18),

    height: responsiveWidth(18),

    backgroundColor: '#F8F8F8',

    borderWidth: 1.5,

    borderRadius: 18,

    textAlign: 'center',

    fontSize: responsiveFontSize(3),

    fontWeight: '800',

    color: '#181725',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 3,
  },

  verifyBtn: {
    height: responsiveHeight(7.2),

    width: '100%',

    backgroundColor: '#BC8A45',

    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: responsiveHeight(8),

    shadowColor: '#BC8A45',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 7,
  },

  verifyBtnText: {
    color: '#FFFFFF',

    fontSize: responsiveFontSize(2),

    fontWeight: '800',

    letterSpacing: 0.5,
  },

  resendContainer: {
    flexDirection: 'row',

    justifyContent: 'center',

    marginTop: responsiveHeight(4),
  },

  resendText: {
    fontSize: responsiveFontSize(1.7),

    color: '#7C7C7C',
  },

  resendLink: {
    fontSize: responsiveFontSize(1.7),

    color: '#BC8A45',

    fontWeight: '700',
  },
});
