import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import Fontisto from "@expo/vector-icons/Fontisto";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleSendCode = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();
    if (json.success) {
    //   Alert.alert("Success", "Verification code sent to your email.");
    Toast.show({
        type: "success",
        text1: "Verification code has been sent to you email",
        // text2: "Fill mandatory details",
        visibilityTime: 5000,
      });
      navigation.navigate('ResetPassword', { email });
    } else {
    //   Alert.alert("Error", json.message);
    Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was some error while resetting password",
        // text2: "Fill mandatory details",
        visibilityTime: 5000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
          style={styles.bg}
          source={require("../../assets/bg_login.jpg")}
          />
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/rml.png")}
          />
          <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:20,color:'#F0BF72',fontWeight:600}}>Route</Text>
          <Text style={{fontSize:20,color:'#34A751',fontWeight:600}}>Master</Text>
          </View>
        </View>
      <View style={styles.loginContainer}>
      <Text style={styles.text_header}>FORGOT PASSWORD</Text>
      <View style={styles.action}>
          <Fontisto
            name="email"
            color="#34A751"
            style={styles.smallIcon}
          />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
      </View>
      <TouchableOpacity
              style={styles.inBut}
              onPress={handleSendCode}
            >
              <View>
                <Text style={styles.textSign}>Send Verification Code</Text>
              </View>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Send Verification Code</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF6E9'
  },
  text_header: {
    color: '#18b152',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign:'center',
    marginBottom:10,
    marginTop:-10
  },
  button: {
    backgroundColor: '#18b152',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
  bg:{
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
    width:'100%',
    height:300,
    opacity:0.3
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    marginTop:-70,
    marginBottom:30
  },
  logo:{
    marginTop:20,
    height: 100,
    width: 100,
  },
  loginContainer: {
    width:'90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 50,
    margin:20,
    shadowColor:'gold',
    elevation:2,
    shadowOpacity:1
  },
  textInput: {
    flex: 1,
    marginTop: -4,
    color: '#05375a',
  },
  action: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'gold',
    borderRadius: 12,
    marginHorizontal:5
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
    width:25
  },
  inBut: {
    width: '75%',
    backgroundColor: '#18b152',
    alignItems: 'center',
    alignSelf:'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop:20
  },
  bottomText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  textSign: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ForgotPassword;
