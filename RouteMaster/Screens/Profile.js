import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Avatar, RadioButton } from 'react-native-paper';
import Back from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';


const height = Dimensions.get('window').height * 1;

const Profile = ({ signOut }) => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        const response = await fetch(`${apiUrl}/api/auth/userdata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();
        if (response.ok) {
          const { name, email, gender = '', mobile, image = '' } = result.data;
          setName(name || '');
          setEmail(email || '');
          setGender(gender || '');
          setMobile(mobile || '');
          setImage(image || '');
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error fetching user data',
          text2: error.message,
        });
      }
    };

    fetchUserData();
  }, []);

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: 'error',
        text1: 'Permission denied',
        text2: 'You need to grant camera roll permissions to select a photo.',
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const data = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(data);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          gender,
          mobile,
          image,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Profile updated successfully',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating profile',
        text2: error.message,
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Password updated successfully',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating password',
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor='#34A751' barStyle='light-content' />
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Back name="arrow-back" size={30} style={styles.backIcon} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={styles.nameText}>Profile</Text>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
          <View style={styles.camDiv}>
            <View style={styles.camIconDiv}>
              <Back name="camera" size={22} style={styles.cameraIcon} />
            </View>

            <TouchableOpacity onPress={() => selectPhoto()}>
              <Avatar.Image
                size={140}
                style={styles.avatar}
                source={{
                  uri: image === "" || image == null ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC' : image,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Username</Text>
              <TextInput
                placeholder="Your Name"
                placeholderTextColor={'#999797'}
                style={styles.infoEditSecond_text}
                onChange={e => setName(e.nativeEvent.text)}
                defaultValue={name}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Email</Text>
              <TextInput
                editable={false}
                placeholder="Your Email"
                placeholderTextColor={'#999797'}
                style={styles.infoEditSecond_text}
                onChange={e => setEmail(e.nativeEvent.text)}
                defaultValue={email}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Gender</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.radioView}>
                  <Text style={styles.radioText}>Male</Text>
                  <RadioButton
                    color='#34A751'
                    value="Male"
                    status={gender === 'Male' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setGender('Male');
                    }}
                  />
                </View>
                <View style={styles.radioView}>
                  <Text style={styles.radioText}>Female</Text>
                  <RadioButton
                    color='#34A751'
                    value="Female"
                    status={gender === 'Female' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setGender('Female');
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Mobile No</Text>
              <TextInput
                placeholder="Your Mobile No"
                placeholderTextColor={'#999797'}
                keyboardType="numeric"
                maxLength={10}
                style={styles.infoEditSecond_text}
                onChange={e => setMobile(e.nativeEvent.text)}
                defaultValue={mobile}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Current Password</Text>
              <TextInput
                placeholder="Current Password"
                placeholderTextColor={'#999797'}
                secureTextEntry={true}
                style={styles.infoEditSecond_text}
                onChange={e => setCurrentPassword(e.nativeEvent.text)}
                value={currentPassword}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>New Password</Text>
              <TextInput
                placeholder="New Password"
                placeholderTextColor={'#999797'}
                secureTextEntry={true}
                style={styles.infoEditSecond_text}
                onChange={e => setNewPassword(e.nativeEvent.text)}
                value={newPassword}
              />
            </View>

            <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Confirm New Password</Text>
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor={'#999797'}
                secureTextEntry={true}
                style={styles.infoEditSecond_text}
                onChange={e => setConfirmPassword(e.nativeEvent.text)}
                value={confirmPassword}
              />
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={styles.inBut} onPress={handleUpdateProfile}>
              <View>
                <Text style={styles.textSign}>Update Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={styles.inBut} onPress={handleUpdatePassword}>
              <View>
                <Text style={styles.textSign}>Update Password</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={styles.inBut} onPress={signOut}>
              <View>
                <Text style={styles.textSign}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFF6E9',
    height: '100%'
  },
  loading: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    height: 1000,
  },
  button: {
    alignItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 15
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inBut: {
    width: '50%',
    backgroundColor: '#18b152',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  header: {
    backgroundColor: '#34A751',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 80,
    marginTop: 30,
    backgroundColor: 'white',
    height: 160,
    width: 160,
    padding: 8,
    borderColor: '#F0BF72',
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  camIconDiv: {
    position: 'absolute',
    right: 142,
    zIndex: 1,
    bottom: 5,
    height: 36,
    width: 36,
    backgroundColor: '#34A751',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  cameraIcon: {
    color: 'white',
  },
  backIcon: {
    marginLeft: 20,
    color: 'white',
  },
  form: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    margin: 20,
    shadowColor: 'gold',
    elevation: 2,
    shadowOpacity: 1
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoEditView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  infoEditFirst_text: {
    color: '#34A751',
    fontSize: 16,
    fontWeight: '400',
  },
  infoEditSecond_text: {
    color: 'black',
    fontStyle: 'normal',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
  radioView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioText: {
    color: 'black',
    fontSize: 15,
  },
});

export default Profile;
