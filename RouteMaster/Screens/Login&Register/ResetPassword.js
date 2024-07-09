import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
      <Text style={styles.header}>Reset Password</Text>
      <View style={styles.action}>
        <FontAwesome
          name="lock"
          color="#420475"
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
          color="#420475"
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
      <View style={styles.registerbutton}>
        <TouchableOpacity style={styles.inBut} onPress={handleResetPassword}>
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  smallIcon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 20,
  },
  registerbutton: {
    alignItems: 'center',
    marginTop: 30,
  },
  inBut: {
    backgroundColor: '#18b152',
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  textSign: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResetPassword;
