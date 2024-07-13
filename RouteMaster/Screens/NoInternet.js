import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternet = ({ navigation }) => {
  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected && state.isInternetReachable) {
      navigation.replace('App'); // Replace 'App' with the appropriate initial screen in your app
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No internet connection. Please check your connection.</Text>
      <Button title="Retry" onPress={handleRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default NoInternet;
