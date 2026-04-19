import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useDispatch } from 'react-redux';
import { setAddress } from '../../redux/cartSlice';
import { ActivityIndicator, Alert } from 'react-native';

const Addressscreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [pinCode, setPinCode] = useState('110034');
  const [state, setState] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [selectedTag, setSelectedTag] = useState('Home');
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);

  const handelSave = async () => {
if (!addressLine || !city || !pinCode) {
      Alert.alert("Missing Info", "Please fill in the Address, City, and Pin Code.");
      return;
    }

    setLoading(true);
    //address String
const fullManualAddress = `${addressLine}, ${locality}, ${city}, ${state} - ${pinCode}`;
try {
      console.log("Fetching coordinates from Nominatim");

      const baseUrl = "https://nominatim.openstreetmap.org/search";
      const params = new URLSearchParams({
        format: 'json',
        street: `${addressLine}, ${locality}`,
        city: city,
        state: state,
        postalcode: pinCode,
        country: 'India', 
        limit: 1
      });
      const response = await fetch
       (`${baseUrl}?${params.toString()}`, 
       {

   headers: { 'User-Agent': 'FlourBuddyApp/1.0' }
        }
      );
   const data = await response.json();
console.log("Nominatim API Data:", data);
    let manualCoords = { latitude: 28.6139, longitude: 77.2090 };

  if (data && data.length > 0) {
        manualCoords = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        console.log("Location Found! Coords:", manualCoords);
      } else {
        console.warn("No location found for this string. Using fallback (Delhi).");
        const pinCodeRes = await fetch(`${baseUrl}?format=json&postalcode=${pinCode}&country=India`, {
            headers: { 'User-Agent': 'FlourBuddyApp/1.0' }
        });
        const pinCodeData = await pinCodeRes.json();
        
        if (pinCodeData.length > 0) {
            manualCoords = {
                latitude: parseFloat(pinCodeData[0].lat),
                longitude: parseFloat(pinCodeData[0].lon),
            };
            console.log("PinCode Location Found via Pin Code:", manualCoords);
        }
  
      }

    dispatch(setAddress({
      title: selectedTag,
      address: fullManualAddress,
      isManual: true,
      coords: manualCoords,
    }));

    navigation.goBack();
  } catch (error) {
    console.error("Geocoding failed", error);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Address</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            <View style={[styles.inputGroup, { width: '48%' }]}>
              <Text style={styles.label}>Pin Code</Text>
              <TextInput
                style={styles.input}
                value={pinCode}
                onChangeText={setPinCode}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { width: '48%' }]}>
              <Text style={styles.label}>State</Text>
              <TextInput 
                style={styles.input} 
                value={state}
                onChangeText={setState}
                placeholderTextColor="#999" 
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address (House No, Building, Street, Area)</Text>
            <TextInput 
              style={styles.input} 
              value={addressLine}
              onChangeText={setAddressLine}
              placeholderTextColor="#999" 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Locality/Town</Text>
            <TextInput 
              style={styles.input} 
              value={locality}
              onChangeText={setLocality}
              placeholderTextColor="#999" 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City/District</Text>
            <TextInput 
              style={styles.input} 
              value={city}
              onChangeText={setCity}
              placeholderTextColor="#999" 
            />
          </View>

          <Text style={styles.sectionLabel}>Save this address as</Text>
          <View style={styles.tagRow}>
            {['Home', 'Office', 'Other'].map((tag) => (
              <TouchableOpacity 
                key={tag}
                onPress={() => setSelectedTag(tag)}
                style={selectedTag === tag ? styles.tagActive : styles.tag}
              >
                <Text style={selectedTag === tag ? styles.tagTextActive : styles.tagText}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={isDefault ? styles.checkboxActive : styles.checkboxInactive}>
                {isDefault && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Make this as my default address</Text>
          </TouchableOpacity>
        </ScrollView>

<View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && { backgroundColor: '#ccc' }]} 
          onPress={handelSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Addressscreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    height: responsiveHeight(8),
  },
  backArrow: {
    fontSize: responsiveFontSize(4),
    color: '#000',
    marginRight: responsiveWidth(3),
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '600',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
  },
  inputGroup: {
    marginBottom: responsiveHeight(3),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    color: '#A1A1A1',
    marginBottom: responsiveHeight(1),
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    color: '#000',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1.5),
    color: '#000',
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(4),
  },
  tag: {
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: responsiveWidth(3),
  },
  tagActive: {
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 8,
    backgroundColor: '#C6934D',
    marginRight: responsiveWidth(3),
  },
  tagText: {
    fontSize: responsiveFontSize(1.7),
    color: '#000',
  },
  tagTextActive: {
    fontSize: responsiveFontSize(1.7),
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(5),
  },
  checkboxActive: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#C6934D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxInactive: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 12,
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: responsiveFontSize(1.7),
    color: '#000',
  },
  footer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(3),
  },
  saveButton: {
    backgroundColor: '#C6934D',
    height: responsiveHeight(7),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C6934D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
});