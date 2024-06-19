import React, { useEffect } from 'react'
import { StyleSheet, Text, View,Button } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';


const Home = () => {

    const navigation=useNavigation()

    const handleBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Exit',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };
    
      useFocusEffect(
        React.useCallback(() => {
          
          BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          };
        },[]),
      );
    
    
    // console.log(props)
  return (
    <View style={styles.viewStyle}>
        <Text style={styles.headingStyle}>React Native Navigation</Text>
        <Text style={styles.textStyle}>This is Home Screen</Text>    
        <Button title='Map page' 
        onPress={() => navigation.navigate('Map1')}/>   
    </View>
  )
}


const styles=StyleSheet.create({
    viewStyle:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    textStyle:{
        fontSize:20,
        color:'black'
    },
    headingStyle:{
        fontSize:30,
        color:'black',
        textAlign:'center'
    }
})

export default Home
