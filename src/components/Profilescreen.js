import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
const Profilescreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userProfile');
      if (storedData) {
        const data = JSON.parse(storedData);
        setName(data.name || '');
        setEmail(data.email || '');
        setMobile(data.mobile || '');
        setPhoto(data.photo || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const profileData = { name, email, mobile, photo };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile Updated Successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          {/* <Pressable onPress={handlegoBack}> */}
          <Ionicons
            name="chevron-back"
            size={26}
            style={styles.back}
            onPress={() => navigation.goBack()}
          />
          {/* </Pressable> */}
          <Text style={styles.header}>Profile</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.underline} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.underline} />

          <Text style={styles.label}>Mobile No.</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
          />
          <View style={styles.underline} />
        </View>

        <TouchableOpacity
          style={styles.updateBtn}
          activeOpacity={0.8}
          onPress={handleUpdate}
        >
          <Text style={styles.updateText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profilescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scroll: {
    paddingBottom: responsiveHeight(5),
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: responsiveHeight(6),
    marginLeft: responsiveWidth(4),
  },
  header: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'Raleway-SemiBold',
    marginLeft: responsiveWidth(3),
  },

  back: {
    alignSelf: 'center',
  },

  content: {
    marginTop: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(6),
  },

  label: {
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(2),
    color: '#7C7C7C',
  },

  input: {
    height: responsiveHeight(8),
    fontSize: responsiveFontSize(2),
    color: '#000',
    fontWeight: 'bold',
  },

  underline: {
    height: 1,

    backgroundColor: '#E2E2E2',
    width: '100%',
  },

  updateBtn: {
    height: responsiveHeight(7),
    width: '88%',
    backgroundColor: '#BD8D46',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: responsiveHeight(35),
  },

  updateText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'Raleway-SemiBold',
  },
});
