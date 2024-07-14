const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet
} = require("react-native");
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import Error from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

import { useState } from "react";

const Register = ({ props }) => {
  const [name, setName] = useState("");
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const userData = {
      name: name,
      email,
      mobile,
      password,
    };

    if (nameVerify && emailVerify && mobileVerify && passwordVerify) {
      const response = await fetch(`${apiUrl}/api/auth/createuser`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        Alert.alert("Registered Successfully");
        navigation.navigate("Login");
      } else {
        Alert.alert(json.success);
      }
    } else {
      // Alert.alert("Fill mandatory details")
      Toast.show({
        type: "error",
        text1: "Error!!",
        text2: "Fill mandatory details",
        visibilityTime: 5000,
      });
    }

    // if (json.success) {
    //   // Save the auth token and redirect
    //   localStorage.setItem('token', json.authtoken);
    //   navigate("/");
    //   props.showAlert("Registered Successfully", "success")
    // }
    // else {
    //   props.showAlert("Invalid credentials", "danger")
    // }
  };

  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);

    if (nameVar.length > 1) {
      setNameVerify(true);
    }
  }

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
    }
  }

  function handleMobile(e) {
    const mobileVar = e.nativeEvent.text;
    setMobile(mobileVar);
    setMobileVerify(false);
    if (/[6-9]{1}[0-9]{9}/.test(mobileVar)) {
      setMobile(mobileVar);
      setMobileVerify(true);
    }
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={"always"}
    >
      <View style={styles.container}>
      <Image
          style={styles.bg}
          source={require("../../assets/bg_login.jpg")}
          />
        <View style={styles.logoContainer}>
        <Image
            style={styles.logo1}
            source={require("../../assets/rml.png")}
          />
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:20,color:'#F0BF72',fontWeight:600}}>Route</Text>
            <Text style={{fontSize:20,color:'#34A751',fontWeight:600}}>Master</Text>
          </View>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>SIGN UP</Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#34A751"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Name"
              style={styles.textInput}
              onChange={(e) => handleName(e)}
            />

            {name.length < 1 ? null : nameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>

          {name.length < 1 ? null : nameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Name sholud be more then 1 characters.
            </Text>
          )}

          <View style={styles.action}>
            <Fontisto
              name="email"
              color="#34A751"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChange={(e) => {
                handleEmail(e);
              }}
            />

            {email.length < 1 ? null : emailVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>

          {email.length < 1 ? null : emailVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Enter Proper Email Address
            </Text>
          )}

          <View style={styles.action}>
            <FontAwesome
              name="mobile"
              color="#34A751"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Mobile"
              style={styles.textInput}
              onChange={(e) => {
                handleMobile(e);
              }}
            />

            {mobile.length < 1 ? null : mobileVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>

          {mobile.length < 1 ? null : mobileVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Phone number with 6-9 and remaing 9 digit with 0-9
            </Text>
          )}

          <View style={styles.action}>
            <FontAwesome name="lock" color="#34A751" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              onChange={(e) => handlePassword(e)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Feather
                  name="eye-off"
                  style={{ marginRight: -10 }}
                  color={passwordVerify ? "green" : "red"}
                  size={23}
                />
              ) : (
                <Feather
                  name="eye"
                  style={{ marginRight: -10 }}
                  color={passwordVerify ? "green" : "red"}
                  size={23}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#34A751" style={styles.smallIcon} />
            <TextInput
              placeholder="Confirm Password"
              style={styles.textInput}
              onChange={(e) => handlePassword(e)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Feather
                  name="eye-off"
                  style={{ marginRight: -10 }}
                  color={passwordVerify ? "green" : "red"}
                  size={23}
                />
              ) : (
                <Feather
                  name="eye"
                  style={{ marginRight: -10 }}
                  color={passwordVerify ? "green" : "red"}
                  size={23}
                />
              )}
            </TouchableOpacity>
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Uppercase, Lowercase, Number and 6 or more characters.
            </Text>
          )}
          <View style={styles.registerbutton}>
            <TouchableOpacity
              style={styles.inBut}
              onPress={() => {
                handleSubmit();
              }}
            >
              <View>
                <Text style={styles.textSign}>Register</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.button}>
          <View style={{ padding: 15 }}>
            <Text
              style={{ fontSize: 14, fontWeight: "bold", color: "#919191" }}
            >
              ----Or Continue with----
            </Text>
          </View>
            <View style={{alignItems:'center'}}>
              <TouchableOpacity style={styles.inBut2}>
                <Image
                style={styles.googleimg}
                source={require('../../assets/google1.png')}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Google</Text>
            </View>
          </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'green',
  },
  container:{
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF6E9'
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
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
    width:25
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:{
    marginTop:100,
    height: 100,
    width: 100,
  },
  logo1:{
    marginTop:5,
    height: 100,
    width: 100,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 9,
    paddingBottom: 9,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'gold',
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
    marginTop: -3,

    color: '#05375a',
  },
  loginContainer: {
    width:'92%',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    margin:15,
    shadowColor:'gold',
    elevation:2,
    shadowOpacity:1
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  text_header: {
    color: '#18b152',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign:'center'
  },
  loginbutton: {
    alignItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20
  },
  registerbutton: {
    alignItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20
  },
  button: {
    alignItems: 'center',
    marginTop: -20,
    alignItems: 'center',
    textAlign: 'center',
    margin: 20,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#18b152',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  inBut2: {
    backgroundColor: '#fff',
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-5
  },
  googleimg:{
    height:65,
    width:65
  },
  smallIcon2: {
    fontSize: 40,
    // marginRight: 10,
  },
  bottomText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  radioButton_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioButton_inner_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton_title: {
    fontSize: 20,
    color: '#420475',
  },
  radioButton_text: {
    fontSize: 16,
    color: 'black',
  },
});

export default Register;
