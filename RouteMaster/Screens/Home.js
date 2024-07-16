import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button, Image, ScrollView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';


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
    
    const slides=[
    {
      key: '1',
      title: 'Hello All 1',
      text: 'Say something cool',
      image: require('../assets/signUp.png'),
      backgroundColor: 'red'
    },
    {
      key: '2',
      title: 'Be Cool',
      text: 'Other Cool Stuff',
      image: require('../assets/bg_login.jpg'),
      backgroundColor: 'blue'
    },
    {
      key: '3',
      title: 'Let us Start',
      text: 'We are already cool',
      image: require('../assets/signUp.png'),
      backgroundColor: 'green'
    }
  ]
  const renderSlide=({item})=>{
    console.log('Rendering slide:', item);
    return(
    <View>
      {/* <Text style={{fontSize:30,textAlign:'center'}}>{item.title}</Text> */}
      <Image source={item.image} style={{height:300,width:355}} />
    </View>
    );
  }
    // console.log(props)
  return (
    <ScrollView>
    <View style={styles.viewStyle}>
      <AppIntroSlider 
      data={slides}
      renderItem={renderSlide}
      style={{height:300,width:350,borderWidth:1}}
      />
        <Text style={styles.headingStyle}>React Native Navigation</Text>
        <Text style={styles.textStyle}>This is Home Screen</Text>    
        <Button title='Map1 page' 
        onPress={() => navigation.navigate('Map1')}/>
        <Button title='Map2 page' 
        onPress={() => navigation.navigate('Map2')}/>
    </View>
    </ScrollView>
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
