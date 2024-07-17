import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icons from Ionicons
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const navigation = useNavigation();

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
    }, [])
  );

  const slides = [
    {
      key: '1',
      title: 'Hello All 1',
      text: 'Say something cool',
      image: require('../assets/home2.png'),
      backgroundColor: 'red',
    },
    {
      key: '2',
      title: 'Be Cool',
      text: 'Other Cool Stuff',
      image: require('../assets/home1.jpg'),
      backgroundColor: 'blue',
    },
    {
      key: '3',
      title: 'Be Cool',
      text: 'Other Cool Stuff',
      image: require('../assets/home3.png'),
      backgroundColor: 'blue',
    },
    {
      key: '4',
      title: 'Let us Start',
      text: 'We are already cool',
      image: require('../assets/home4.png'),
      backgroundColor: 'green',
    },
  ];

  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  const renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <Icon name="chevron-forward" color="rgba(255, 255, 255, .9)" size={24} />
    </View>
  );

  const renderPrevButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons name="chevron-back" color="rgba(255, 255, 255, .9)" size={24} />
    </View>
  );

  return (
    <ScrollView style={{backgroundColor:'#FFF6E9'}}>
      <View style={styles.viewStyle}>
        <AppIntroSlider
          data={slides}
          renderItem={renderSlide}
          renderNextButton={renderNextButton}
          renderPrevButton={renderPrevButton}
          showDoneButton={false}
          showPrevButton
          style={styles.slider}
        />
        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Map1')}
          >
            <View style={styles.box1}>
              <Image source={require('../assets/window2.png')} style={styles.icon}/>
            <View style={{width:140}}>
              <Text style={styles.boxtext}>Optimize Route With Time Window</Text>
            </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Map2')} 
          >
            <View style={styles.box2}>
              <Image source={require('../assets/deadline2.png')} style={styles.icon}/> 
            <View style={{width:140}}>
              <Text style={styles.boxtext}>Optimize Route With Deadline</Text>
            </View>
            </View>
          </TouchableOpacity>
              {/* <Text style={styles.boxtext}>Optimize Route With Deadline</Text> */}
        </View>
        {/* <View style={styles.bg}>
        </View> */}
        {/* <Button title="Map1 page" onPress={() => navigation.navigate('Map1')} />
        <Button title="Map2 page" onPress={() => navigation.navigate('Map2')} /> */}
        {/* <Image source={require('../assets/bg_login.jpg')} style={styles.bg} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    fontSize: 20,
    color: 'black',
  },
  headingStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 290,
    width: 'auto',
    margin: 8,
    borderRadius: 20,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 280,
    width: 345,
    borderRadius: 20,
  },
  buttonCircle: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-117.5,
    margin:-5
  },
  box1:{
    height:270,
    width:160,
    borderWidth:1,
    backgroundColor:'#fff',
    borderRadius:20,
    alignItems:'center',
    flex:1,
    justifyContent:'center',
    marginTop:15,
    borderColor:'gold'
  },
  box2:{
    height:270,
    width:160,
    borderWidth:1,
    backgroundColor:'#fff',
    borderRadius:20,
    alignItems:'center',
    flex:1,
    justifyContent:'center',
    marginTop:15,
    borderColor:'gold'
  },
  boxtext:{
    fontSize:14,
    textAlignVertical:'center',
    textAlign:'center',
    color:'#34A751',
    fontWeight:'600',
    marginTop:10
  },
  icon:{
    height:150,
    width:150,
    margin:10
  },
});

export default Home;
