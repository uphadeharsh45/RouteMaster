import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TabNav,LoginNav } from './Navigation'; // Import TabNav from Navigation.js
import Login from './Screens/Login&Register/Login';
import Register from './Screens/Login&Register/Register';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';


const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'green',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: 'red',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'red',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};


export default function App() {

  const [isLoggedIn,setIsLoggedIn]=useState(false);

  const getData=async()=>
    {
      const data=await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(data);
    }

    const signOut = async () => {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  
    useEffect(()=>{
      getData();
    },[]);

  return (
    <NavigationContainer>
      {isLoggedIn?<TabNav signOut={signOut}/>:<LoginNav setIsLoggedIn={setIsLoggedIn}/>}
      <Toast config={toastConfig}/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
