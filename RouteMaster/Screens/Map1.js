import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator, Text, TextInput, Button, Alert, TouchableOpacity, Modal, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';



const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
  const [cl,setCL]=useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);


  const mapRef = useRef(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCL({latitude:latitude,longitude:longitude});
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

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = () => {
    if (userName && userMobile && startTime && endTime) {
      const newLocation = {
        name: userName,
        phoneNumber:userMobile,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        latitude: marker.latitude,
        longitude: marker.longitude,
      };
      setLocations([...locations, newLocation]);
      setModalVisible(false);
      setShowConfirmButton(false);
      Alert.alert('Location Confirmed', `Name: ${userName}\nMobile: ${userMobile}\nDelivery Time: ${formatTime(startTime)} - ${formatTime(endTime)}`);
      console.log(locations);
    } else {
      Alert.alert('Error', 'Please fill all the fields');
    }
  };

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

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setShowConfirmButton(true);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSaveRoute = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
    try {
      const token = await AsyncStorage.getItem('token');
      // console.log(token)
      if(token)console.log(token)
        else console.log("No token")
      const response = await fetch(`${apiUrl}/api/routes/addtwroute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ locations }),
      });
  
      const text = await response.text();
      console.log('Response Text:', text);
  
      // Attempt to parse the response text as JSON
      const data = JSON.parse(text);
      console.log('Route added successfully:', data);
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };
  
  const removeLeadingZeros = (time) => {
    return time.split(':').map(part => String(Number(part))).join(':');
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleGetDirections = async() => {
    const latLongArray = locations.map(location => ({
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  
    // Append the current location to the beginning of the array
    if (cl) {
      latLongArray.unshift(cl);
    } else {
      console.log('Current location not available');
    }
  
    const currentFormattedTime = removeLeadingZeros(getCurrentTime());
    const timeWindows = [
      [
        removeLeadingZeros(getCurrentTime()), // Current time
     "23:24"// Current time + 3 hours
      ],
      ...locations.map(location => [
        removeLeadingZeros(location.startTime),
        removeLeadingZeros(location.endTime),
      ]),
    ];
  
    console.log('Latitude and Longitude Array:', latLongArray);
    console.log('Time Windows Array:', timeWindows);

    const requestData = {
      locations: latLongArray,
      timeWindows:timeWindows,
      numVehicles: 1,
      startTime: currentFormattedTime,
    };
    try {
      const response = await fetch(`${apiUrl}/get-travel-times`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      const optimizedRouteCoordinates = data[0].map(index => latLongArray[index]);

      // Store the optimized route coordinates
      setOptimizedRoute(optimizedRouteCoordinates);
      console.log('Optimized Route:', data);
    } catch (error) {
      console.error('Error fetching optimized route:', error);
    }

  };

  return (
    <BottomSheetModalProvider>
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
              onPress={handleMapPress}
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
              {optimizedRoute && (
              <MapViewDirections
                origin={optimizedRoute[0]}
                destination={optimizedRoute[optimizedRoute.length - 1]}
                waypoints={optimizedRoute.slice(1, -1)}
                apikey={API_KEY}
                strokeWidth={3}
                strokeColor="hotpink"
                onStart={(params) => {
                  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
                onReady={result => {
                  console.log(`Distance: ${result.distance} km`);
                  console.log(`Duration: ${result.duration} min.`);
                }}
                onError={(errorMessage) => {
                  console.error(errorMessage);
                }}
              />
            )}
            </MapView>
            {showConfirmButton && (
              <View style={styles.buttonContainer}>
                <Button title="Confirm Location" onPress={handleConfirmLocation} />
              </View>
            )}
            {locations.length > 0 ? (
              <TouchableOpacity style={styles.modalButton} onPress={handlePresentModalPress}>
                <Ionicons name="information-circle" size={24} color="white" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
              <FontAwesome name="location-arrow" size={24} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.sheetTitle}>Saved Locations</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {locations.map((location, index) => (
                <View key={index} style={styles.locationItem}>
                  <Text style={styles.locationText}>{location.name}</Text>
                  <Text style={styles.locationText}>{location.phoneNumber}</Text>
                  <Text style={styles.locationText}>{`${location.startTime} - ${location.endTime}`}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.buttonGroup}>
              <Button title="Save Route" onPress={handleSaveRoute} />
              <Button title="Get Directions" onPress={handleGetDirections} />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
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
              <Text style={styles.timeText}>Start Time: {formatTime(startTime)}</Text>
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
              <Text style={styles.timeText}>End Time: {formatTime(endTime)}</Text>
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
    </BottomSheetModalProvider>
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
  modalButton: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  locationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '90%',
  },
  locationText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
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
