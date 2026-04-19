import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splashscreen from '../screens/Splashscreen/Splashscreen';
import Loginscreen from '../screens/Loginscreen/Loginscreen';
import Homescreen from '../screens/Homescreen/Homescreen';
import OTPscreen from '../screens/OTPscreen/OTPscreen';
import Notificationscreen from '../screens/Notificationscreen/Notificationscreen'
import Menuscreen from '../screens/Menuscreen/Menuscreen'
import Recommendedscreen from '../screens/Recommendedscreen/Recommendedscreen'
import TabNavigator from '../navigations/TabNavigator'
import  Viewcartscreen from '../screens/Viewcartscreen/Viewcartscreen'
import CartAddressscreen from '../screens/CartAddressscreen/CartAddressscreen'
import Address from '../components/Address'
import OrderSuccessfulsscreen from '../screens/OrderSuccessfulsscreen/OrderSuccessfulsscreen'
import TrackOrderscreen from '../screens/TrackOrderscreen/TrackOrderscreen'
import Paymentscreen from '../screens/Paymentscreen/Paymentscreen'
import OrderDetailscreen from '../screens/OrderDetailscreen/OrderDetailscreen'
import Addressscreen from "../screens/Addressscreen/Addressscreen"
import Profilescreen from '../components/Profilescreen';
import Terms from '../components/Terms'
// import Aboutus from '../components/Aboutus'
import Aboutus from '../components/Aboutus';
import Support from '../components/Support'

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splashscreen" component={Splashscreen} />
        <Stack.Screen name="Loginscreen" component={Loginscreen} />
        {/* <Stack.Screen name="Homescreen" component={Homescreen} /> */}
        <Stack.Screen name="OTPscreen" component={OTPscreen} />
        <Stack.Screen name='Notificationscreen' component={Notificationscreen}/>
        <Stack.Screen name='Menuscreen' component={Menuscreen}/>
        <Stack.Screen name="Recommendedscreen" component={Recommendedscreen}/>
        <Stack.Screen name='Viewcartscreen' component={Viewcartscreen}/>
        <Stack.Screen name='CartAddressscreen' component={CartAddressscreen}/>
        <Stack.Screen name='OrderSuccessfulsscreen' component={OrderSuccessfulsscreen}/>
        <Stack.Screen name='TrackOrderscreen' component={TrackOrderscreen}/>
          <Stack.Screen name="Profilescreen" component={Profilescreen} />
          <Stack.Screen name='Paymentscreen' component={Paymentscreen}/>

          <Stack.Screen name='OrderDetailscreen' component={OrderDetailscreen}/>
          <Stack.Screen name='Addressscreen' component={Addressscreen}/>
          <Stack.Screen name="Terms" component={Terms}/>
          <Stack.Screen name='Aboutus' component={Aboutus}/>
          <Stack.Screen name='Support' component={Support}/>
          <Stack.Screen name="Address" component={Address}/>
          <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
