const {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
  } = require('react-native');
  import {useNavigation} from '@react-navigation/native';
  import styles from './style';
  import Feather from 'react-native-vector-icons/Feather';
  import  React,{ useState } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { BackHandler } from 'react-native';
  import { useFocusEffect } from '@react-navigation/native';
  import FontAwesome from '@expo/vector-icons/FontAwesome';
  import Toast from 'react-native-toast-message';


  const Login = ({ setIsLoggedIn }) => {



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

    const navigation=useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const  handleSubmit=async()=> {

      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        console.log(email)
      const userData = {
        email: email,
        password,
      };
  
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });
      const json = await response.json();
      console.log(json);
      if(json.success){
        // Alert.alert("Login Successfull");
        AsyncStorage.setItem("token",json.authtoken);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Welcome',
            visibilityTime: 5000,
          });
          setIsLoggedIn(true);
        navigation.navigate('Home');
      }
      else{
        Toast.show({
            type: 'error',
            text1: 'Error!!',
            text2: 'Invalid Credentials',
            visibilityTime: 5000,
          });
      }
    }

  return (
    <ScrollView
    contentContainerStyle={{flexGrow: 1}}
    keyboardShouldPersistTaps={'always'}>
    <View >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/mainLogo.png')}
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.text_header}>Login !!!</Text>
        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color="#420475"
            style={styles.smallIcon}
          />
          <TextInput
            placeholder="Mobile or Email"
            style={styles.textInput}
            onChangeText={(text)=>setEmail(text)}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
          <TextInput
            placeholder="Password"
            style={styles.textInput}
           onChangeText={(text)=>setPassword(text)}
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: 8,
            marginRight: 10,
          }}>
          <Text style={{color: '#420475', fontWeight: '700'}}>
            Forgot Password
          </Text>
        </View>
      </View>
      <View style={styles.button}>
        <TouchableOpacity style={styles.inBut} onPress={()=>{handleSubmit()}}>
          <View>
            <Text style={styles.textSign}>Log in</Text>
          </View>
        </TouchableOpacity>

        <View style={{padding: 15}}>
          <Text style={{fontSize: 14, fontWeight: 'bold', color: '#919191'}}>
            ----Or Continue as----
          </Text>
        </View>
        <View style={styles.bottomButton}>
        
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.inBut2}
              onPress={()=>{navigation.navigate('Register')}}
             >
              <FontAwesome
                name="user-plus"
                color="white"
                style={[styles.smallIcon2, {fontSize: 30}]}
              />
            </TouchableOpacity>
            <Text style={styles.bottomText}>Sign Up</Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.inBut2}
              >
              <FontAwesome
                name="google"
                color="white"
                style={[styles.smallIcon2, {fontSize: 30}]}
              />
            </TouchableOpacity>
            <Text style={styles.bottomText}>Google</Text>
          </View>
         
        </View>
      </View>
    </View>
    </ScrollView>
  )
}




export default Login
