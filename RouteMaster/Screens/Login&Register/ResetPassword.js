import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Error from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const ResetPassword = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = (e) => {
    const passwordVar = e;
    setNewPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPasswordVerify(true);
    }
  };

  const handleResetPassword = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (passwordVerify) {
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const json = await response.json();
      if (json.success) {
        Toast.show({
            type: "success",
            text1: "Password reset successful !",
            // text2: json.message,
            visibilityTime: 5000,
          });
        navigation.navigate('Login');
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: json.message,
          visibilityTime: 5000,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error!!",
        text2: "Password does not meet criteria",
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
      <Text style={styles.text_header}>RESET PASSWORD</Text>
    <View style={styles.action}>
    <FontAwesome
      name="lock"
      color="#34A751"
      style={styles.smallIcon}
    />
    <TextInput
      style={styles.textInput}
      placeholder="Enter verification code"
      value={code}
      onChangeText={setCode}
    />
  </View>
  <View style={styles.action}>
    <FontAwesome
      name="lock"
      color="#34A751"
      style={styles.smallIcon}
    />
    <TextInput
      style={styles.textInput}
      placeholder="Enter new password"
      secureTextEntry={!showPassword}
      onChangeText={(e) => handlePassword(e)}
    />
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      {!showPassword ? (
        <Feather name="eye-off" style={{ marginRight: -10 }} color={passwordVerify ? "green" : "red"} size={23} />
      ) : (
        <Feather name="eye" style={{ marginRight: -10 }} color={passwordVerify ? "green" : "red"} size={23} />
      )}
    </TouchableOpacity>
  </View>
      {newPassword.length < 1 ? null : passwordVerify ? null : (
        <Text style={styles.errorText}>Uppercase, Lowercase, Number and 6 or more characters.</Text>
      )}
      <TouchableOpacity
              style={styles.inBut}
              onPress={handleResetPassword}
            >
              <View>
                <Text style={styles.textSign}>Reset Password</Text>
              </View>
      </TouchableOpacity>
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
    color: '#34A751',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign:'center',
    marginBottom:10,
    marginTop:-10
  },
  button: {
    backgroundColor: '#34A751',
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
    marginTop: 20,
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
    backgroundColor: '#34A751',
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
  errorText:{
    marginLeft:20,
    fontSize:12,
    color:'red'
  }
});

export default ResetPassword;
