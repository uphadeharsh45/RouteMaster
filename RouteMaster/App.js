import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { TabNav, LoginNav } from './Navigation'; // Import TabNav and LoginNav
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesState from './context/routes/RoutesState';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NoInternet from './Screens/NoInternet'; // Import the No Internet screen

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
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
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
      contentContainerStyle={{ paddingHorizontal: 15 }}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const getData = async () => {
    const data = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(data);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    getData();

    const handleConnectivityChange = (state) => {
      const connected = state.isConnected && state.isInternetReachable;
      if (isConnected !== connected) {
        setIsConnected(connected);
        if (connected) {
          Toast.show({
            type: 'success',
            text1: 'Online',
            text2: 'You are back online!',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Offline',
            text2: 'You have lost internet connection.',
          });
        }
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  if (!isConnected) {
    return (
      <RoutesState>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <NoInternet />
          </NavigationContainer>
        </GestureHandlerRootView>
      </RoutesState>
    );
  }

  return (
    <RoutesState>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {isLoggedIn ? <TabNav signOut={signOut} /> : <LoginNav setIsLoggedIn={setIsLoggedIn} />}
          <Toast config={toastConfig} />
        </NavigationContainer>
      </GestureHandlerRootView>
    </RoutesState>
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
