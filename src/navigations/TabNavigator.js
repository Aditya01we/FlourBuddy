import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homescreen from '../screens/Homescreen/Homescreen';
import Orderscreen from '../screens/Orderscreen/Orderscreen';
import Accountscreen from '../screens/Accountscreen/Accountscreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
            tabBarActiveTintColor: '#BD8D46',
        tabBarInactiveTintColor: '#7C7C7C',
tabBarLabelStyle: {
          fontFamily: 'Raleway-SemiBold',
          fontSize: 14,
          marginBottom: responsiveHeight(1),
        },
        tabBarStyle:{
            height: responsiveHeight(7.5),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }
      }}
    >
      <Tab.Screen name="Home" component={Homescreen} 
       options={{
  tabBarIcon: ({ color }) => (
    <Ionicons name="home" color={color} size={30} />
  ),
  
}}
      />
      <Tab.Screen name="Order" component={Orderscreen} 
             options={{
  tabBarIcon: ({ color}) => (
    <Ionicons name="cart" color={color} size={30} />
  ),
}}
      />
      <Tab.Screen name="Account" component={Accountscreen}
                   options={{
  tabBarIcon: ({ color }) => (
    <Ionicons name="person" color={color} size={30} />
  ),
}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
