import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";

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
      <Text style={styles.header}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Send Verification Code</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#18b152',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ForgotPassword;
