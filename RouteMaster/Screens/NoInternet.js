import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
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
      <Image source={require('../assets/wifi.png')} style={{width:150,height:150}}/>
      <Text style={{fontSize:25,marginBottom:10,fontWeight:'600'}}>WHOOPS!!</Text>
      <Text style={{fontSize:18,textAlign:'center',marginTop:20}}>No internet access.</Text>
      <Text style={styles.text}>Please check your connection.</Text>
      {/* <Button title="Retry" onPress={handleRetry} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF6E9'
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default NoInternet;
