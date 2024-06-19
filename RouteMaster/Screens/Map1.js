import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator, Modal, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_KEY = "AIzaSyDxgAdwDaCyixQZ-GHZRxejom_NGRQ4s8M";
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map1 = () => {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [locations, setLocations] = useState([]); // Array to store location details

  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      setMarker({
        latitude,
        longitude,
      });
    };

    requestLocationPermission();
  }, []);

  const handleConfirmLocation = () => {
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (userName && userMobile && startTime && endTime) {
      const newLocation = {
        userName,
        userMobile,
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        latitude: marker.latitude,
        longitude: marker.longitude,
      };
      setLocations([...locations, newLocation]);
      setModalVisible(false);
      setShowConfirmButton(false);
      Alert.alert('Location Confirmed', `Name: ${userName}\nMobile: ${userMobile}\nDelivery Time: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`);
    } else {
      Alert.alert('Error', 'Please fill all the fields');
    }

  };
  console.log(locations);

  const handleCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    setRegion(newRegion);
    setMarker({ latitude, longitude });
    mapRef.current.animateToRegion(newRegion, 1000);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <>
          <GooglePlacesAutocomplete
            placeholder='Search'
            onPress={(data, details = null) => {
              const { lat, lng } = details.geometry.location;
              const newRegion = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              setRegion(newRegion);
              setMarker({ latitude: lat, longitude: lng });
              mapRef.current.animateToRegion(newRegion, 1000);
              setShowConfirmButton(true);
            }}
            query={{
              key: API_KEY,
              language: 'en',
              components: 'country:in'
            }}
            enablePoweredByContainer={false}
            fetchDetails={true}
            styles={{
              container: { 
                position: 'absolute', 
                width: '100%', 
                zIndex: 1, 
                paddingHorizontal: 10, 
                paddingTop: 20 
              },
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 1,
                marginBottom: 20,
              },
              textInput: {
                backgroundColor: '#fff',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 20,
                fontSize: 16,
              },
              listView: { 
                backgroundColor: 'white', 
                borderRadius: 20, 
                marginHorizontal: 10, 
              },
              row: { 
                backgroundColor: '#fff', 
                padding: 13, 
                height: 44, 
                flexDirection: 'row', 
              },
              separator: {
                height: 0.5,
                backgroundColor: '#c8c7cc',
              },
              description: {
                fontSize: 15,
                color: '#000',
              },
            }}
          />
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {marker && (
              <Marker
                draggable
                coordinate={marker}
                onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
              />
            )}
            {locations.map((location, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title={location.userName}
                description={`Mobile: ${location.userMobile}\nDelivery Time: ${location.startTime} - ${location.endTime}`}
              />
            ))}
          </MapView>
          {showConfirmButton && (
            <View style={styles.buttonContainer}>
              <Button title="Confirm Location" onPress={handleConfirmLocation} />
            </View>
          )}
          <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
            <FontAwesome name="location-arrow" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            value={userMobile}
            onChangeText={setUserMobile}
            keyboardType="phone-pad"
          />
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.timeText}>Start Time: {startTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartPicker(false);
                setStartTime(selectedTime || startTime);
              }}
            />
          )}
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.timeText}>End Time: {endTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndPicker(false);
                setEndTime(selectedTime || endTime);
              }}
            />
          )}
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: '25%',
    right: '25%',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'skyblue',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '80%',
  },
  timeText: {
    marginVertical: 10,
    fontSize: 16,
    color: 'blue',
  },
});

export default Map1;
