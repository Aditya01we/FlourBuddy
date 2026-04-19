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
  Alert
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';

import notifee from '@notifee/react-native';


import NotificationServices from '../../services/NotificationServices';

const OTPscreen = ({ navigation }) => {


const [otp, setOtp] = useState(['', '', '', '']);
const [validCode, setValidCode] = useState(null);
  
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
useEffect(() => {
    handleSendNotification();
  }, []);

const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.lengtAh !== 0 && index < 3) {
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
      `Your OTP is: ${randomOtp}`
    );
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');

    if (enteredOtp === validCode) {
      Alert.alert('Success', 'OTP Verified!');
      navigation.replace('Main');
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '']); 
      inputRefs[0].current.focus();
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="#181725" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.titleText}>OTP Verification</Text>

        <View style={styles.subTextRow}>
          <Text style={styles.subText}>
            OTP has been sent to +91-9876543453{' '}
          </Text>
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
                { borderColor: digit ? '#BC8A45' : '#E2E2E2' },
              ]}
              value={digit}
              onChangeText={text => handleChangeText(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectionColor="#BC8A45"
              placeholder="8"
              placeholderTextColor="#E2E2E2"
            />
          ))}
        </View>

        {/* <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Resend OTP in </Text>
          <Text style={styles.timerText}>{timer}s</Text>
        </View> */}

        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={handleVerify}
        >
          <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
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
    marginTop: responsiveHeight(5),
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(4),
  },
  titleText: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    color: '#181725',
    marginBottom: responsiveHeight(1),
  },
  subTextRow: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(6),
  },
  subText: {
    fontSize: responsiveFontSize(1.7),
    color: '#7C7C7C',
  },
  changeLink: {
    fontSize: responsiveFontSize(1.7),
    color: '#BC8A45',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderWidth: 1.5,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '600',
    color: '#181725',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(4),
  },
  resendText: {
    fontSize: responsiveFontSize(1.8),
    color: '#7C7C7C',
  },
  timerText: {
    fontSize: responsiveFontSize(1.8),
    color: '#BC8A45',
    fontWeight: '700',
  },
  verifyBtn: {
    height: responsiveHeight(7.5),
    width: '100%',
    backgroundColor: '#BC8A45',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(6),
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
  },
});
