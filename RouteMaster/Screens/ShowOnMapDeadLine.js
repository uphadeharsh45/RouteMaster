import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
  } from "react";
  import {
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    Modal,
    
  } from "react-native";
  import MapView, { Marker } from "react-native-maps";
  import * as Location from "expo-location";
  import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
  import {
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    Entypo,
    MaterialIcons
  } from "@expo/vector-icons";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
  } from "@gorhom/bottom-sheet";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import MapViewDirections from "react-native-maps-directions";
  import greenmarker4 from "../assets/greenmarker4.png";
  import Toast from "react-native-toast-message";
  import CustomMarker from "../components/CustomMarker";
  import { SMS } from "../components/SMS";
  import { ScrollView } from "react-native-gesture-handler";
  import { useRoute } from '@react-navigation/native';
  import { useContext } from 'react';
  import routeContext from "../context/routes/routeContext";
  
  
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  const ShowOnMapDeadLine = () => {
    const route = useRoute();
    const context = useContext(routeContext);
    const { updateRoute } = context;
    const [region, setRegion] = useState(null);
    const [marker, setMarker] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [userName, setUserName] = useState("");
    const [userMobile, setUserMobile] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [locations, setLocations] = useState(route.params.locations); // Array to store location details
    const [cl, setCL] = useState(null);
    const [optimizedRoute, setOptimizedRoute] = useState(null);
    const [optimizeWayPoints,setOptimizeWaypoints]=useState(false);
    const [markersWithOrder, setMarkersWithOrder] = useState([]);
    const [textualDirections, setTextualDirections] = useState([]);
  const [directionsModalVisible, setDirectionsModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [tracking, setTracking] = useState(false);
  const locationSubscriptionRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  
  
  
    const mapRef = useRef(null);
    const bottomSheetModalRef = useRef(null);
    const directionsModalRef=useRef(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);
  
    useEffect(() => {
        // Update markers when places change
        setMarkers(locations.map(place => ({name:place.name, latitude: place.latitude, longitude: place.longitude })));
      }, []);
  
  
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setRouteCoordinates([
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
      ]);
  
      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation.coords);
          setRouteCoordinates((prevCoords) => [
            ...prevCoords,
            { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
          ]);
          mapRef.current.animateCamera({
            center: {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            },
            // zoom: 15,
          });
        }
      );
      setTracking(true);
    };
  
    const stopTracking = () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
      setTracking(false);
    };
  
    useEffect(() => {
      return () => {
        if (locationSubscriptionRef.current) {
          locationSubscriptionRef.current.remove();
        }
      };
    }, []);
  
    useEffect(() => {
      const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCL({ latitude: latitude, longitude: longitude });
        setLocation({ latitude: latitude, longitude: longitude });
        // setMarkers(prevMarkers => [...prevMarkers, {name:"current loc", lat: latitude, lng: longitude }]);
  
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
  
    const toggleDirectionsModal = () => {
      setDirectionsModalVisible(true);
    };
  
    const handleTextDirectons=async()=>{
      await fetchTextualDirections();
      handlePresentDirectionsModalPress();
    }
  
    const handleDeleteCustomer = (latToDelete, lngToDelete) => {
      // Remove the customer from the places array
      setLocations(prevLocations => prevLocations.filter(location => location.latitude !== latToDelete || location.longitude !== lngToDelete));
      setMarkers(prevMarkers => prevMarkers.filter(marker => marker.latitude !== latToDelete || marker.longitude !== lngToDelete))
  
      // Remove the corresponding marker from the markers array
      // setMarkers([]);
      
    };
  
    const fetchTextualDirections = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${optimizedRoute[0].latitude},${optimizedRoute[0].longitude}&destination=${optimizedRoute[optimizedRoute.length - 1].latitude},${optimizedRoute[optimizedRoute.length - 1].longitude}&waypoints=${optimizedRoute
            .slice(1, -1)
            .map(
              (coordinate) =>
                `via:${coordinate.latitude},${coordinate.longitude}`
            )
            .join("|")}&key=${API_KEY}`
        );
        const data = await response.json();
        console.log("Textual Directions:", data.routes[0].legs);
        setTextualDirections(data.routes[0].legs);
        
        
      } catch (error) {
        console.error("Error fetching textual directions:", error);
      }
    };
    
  
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
  
    const handleSubmit = () => {
      if (userName && userMobile  && endTime) {
        const newLocation = {
          name: userName,
          phoneNumber: userMobile,
          // startTime: formatTime(startTime),
          time: formatTime(endTime),
          latitude: marker.latitude,
          longitude: marker.longitude,
        };
        setLocations([...locations, newLocation]);
        setMarkers(prevMarkers => [...prevMarkers,{name:userName, latitude:marker.latitude, longitude: marker.longitude } ]);
  
        setModalVisible(false);
        setShowConfirmButton(false);
        Alert.alert(
          "Location Confirmed",
          `Name: ${userName}\nMobile: ${userMobile}\nDelivery Deadline Time:  ${formatTime(endTime)}`
        );
        console.log(locations);
      } else {
        Alert.alert("Error", "Please fill all the fields");
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
    const handleCloseModalPress = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
    }, []);
    const handlePresentDirectionsModalPress = useCallback(() => {
      directionsModalRef.current?.present();
    }, []);
  
    const handleSaveRoute = async () => {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
      try {
        await updateRoute(route.params.routeId,locations)
        Toast.show({
          type: "success",
          text1: "Route saved successfully",
          // text2: "Showing shortest possible path",
          visibilityTime: 5000,
        });
        
        // console.log("Route added successfully:", data);
      } catch (error) {
        console.error("Error adding route:", error);
      }
    };
  
    const removeLeadingZeros = (time) => {
      return time
        .split(":")
        .map((part) => String(Number(part)))
        .join(":");
    };
  
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
  
    const clearMarkers=()=>{
      setMarkers([]);
    }
  
    const handleGetDirections = async () => {
      const latLongArray = locations.map((location) => ({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
  
      // Append the current location to the beginning of the array
      if (cl) {
        latLongArray.unshift(cl);
      } else {
        console.log("Current location not available");
      }
  
      const currentFormattedTime = removeLeadingZeros(getCurrentTime());
      const timeWindows = [
        [
          removeLeadingZeros(getCurrentTime()), // Current time
          "23:59", // Current time + 3 hours
        ],
        ...locations.map((location) => [
         "0:0",
          removeLeadingZeros(location.time),
        ]),
      ];
  
      console.log("Latitude and Longitude Array:", latLongArray);
      console.log("Time Windows Array:", timeWindows);
  
      const requestData = {
        locations: latLongArray,
        timeWindows: timeWindows,
        numVehicles: 1,
        startTime: currentFormattedTime,
      };
      try {
        const response = await fetch(`${apiUrl}/get-travel-times`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
  
        const data = await response.json();
        if(!data)
          {
            setOptimizeWaypoints(true);
            setOptimizedRoute(latLongArray);
            Toast.show({
              type: "error",
              text1: "No possible path",
              text2: "Showing shortest possible path",
              visibilityTime: 5000,
            });
            toggleDirectionsModal();
            handleCloseModalPress();
  
            
            return ;
          }
          const optimizedRouteCoordinates = data[0]
        .map((index) => latLongArray[index])
        .slice(0, -1); 
  
        // Store the optimized route coordinates
        setOptimizedRoute(optimizedRouteCoordinates);
  
        const markersWithOrder = optimizedRouteCoordinates.map((coordinate, index) => ({
          ...coordinate,
          order: index + 1, // Add order property
        }));
          clearMarkers();
          setMarkersWithOrder(markersWithOrder);
          toggleDirectionsModal();
          handleCloseModalPress(); 
          Toast.show({
            type: "success",
            text1: "Fetched Path Successfully",
            text2: "Showing the best possible path",
            visibilityTime: 5000,
          });
  
        console.log("Optimized Route:", data);
      } catch (error) {
        console.error("Error fetching optimized route:", error);
      }
    };
  
    const calculateETA = (startTime, durationInSeconds) => {
      const startTimeInMillis = startTime.getTime();
      const estimatedTimeInMillis = startTimeInMillis + durationInSeconds * 1000;
      const estimatedTime = new Date(estimatedTimeInMillis);
      return estimatedTime;
    };
  
  
  
    const handleSMS = async () => {
      try {
          // Build waypoints string
          const waypoints = optimizedRoute
              .slice(1, -1)
              .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
              .join("|");
  
          const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${optimizedRoute[0].latitude},${optimizedRoute[0].longitude}&destination=${optimizedRoute[optimizedRoute.length - 1].latitude},${optimizedRoute[optimizedRoute.length - 1].longitude}&waypoints=${waypoints}&key=${API_KEY}`;
  
          console.log("Directions API URL:", url); // Log the URL to verify its correctness
  
          const response = await fetch(url);
          const data = await response.json();
  
          // Log the response to inspect the legs
          console.log("API Response:", data);
  
          // Create a map to link optimized route locations with the original locations' phone numbers, excluding the starting location
          const locationMap = new Map();
          locations.forEach((location) => {
              const key = `${location.latitude.toFixed(6)},${location.longitude.toFixed(6)}`;
              locationMap.set(key, location.phoneNumber);
          });
  
          console.log("Location Map:", locationMap);
  
          const now = new Date();
          let accumulatedTime = now.getTime(); // Start with current time in milliseconds
  
          const legs = data.routes[0].legs;
          console.log("legs length : ", legs.length);
  
          if (legs.length === 0) {
              throw new Error("No legs found in the directions response");
          }
  
          for (let i = 0; i < legs.length; i++) {
              const leg = legs[i];
              const durationInSeconds = leg.duration.value;
              const estimatedTime = calculateETA(new Date(accumulatedTime), durationInSeconds); // Calculate estimated time
  
              const latLng = `${optimizedRoute[i + 1].latitude.toFixed(6)},${optimizedRoute[i + 1].longitude.toFixed(6)}`;
              const phoneNumber = '+91' + locationMap.get(latLng);
  
              const msg = `Your delivery time is ${estimatedTime}`;
              console.log("Sending SMS:", msg, "to", phoneNumber);
  
              if (phoneNumber) {
                  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds between SMS sends
                  await SMS(phoneNumber, msg);
              }
  
              accumulatedTime += durationInSeconds * 1000; // Add current leg's duration to accumulated time in milliseconds
          }
      } catch (error) {
          console.error("Error fetching textual directions:", error);
      }
  };
  
    
    
    
  
    // const renderItem = ({ item }) => (
    //   <View style={styles.row}>
    //     <Text style={styles.cell}>{item.name}</Text>
    //     <Text style={styles.cell}>{item.phoneNumber}</Text>
    //     <Text style={styles.cell}>{`${item.startTime} - ${item.endTime}`}</Text>
    //   </View>
    // );
    return (
      <BottomSheetModalProvider>
        <View style={styles.container}>
          {region ? (
            <>
              <GooglePlacesAutocomplete
                placeholder="Search"
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
                  language: "en",
                  components: "country:in",
                }}
                enablePoweredByContainer={false}
                fetchDetails={true}
                styles={{
                  container: {
                    position: "absolute",
                    width: "100%",
                    zIndex: 1,
                    paddingHorizontal: 10,
                    paddingTop: 20,
                  },
                  textInputContainer: {
                    backgroundColor: "rgba(0,0,0,0)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 0,
                    marginBottom: 20,
                    top:10
                  },
                  textInput: {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#34A751",
                    borderRadius: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 16,
                  },
                  listView: {
                    backgroundColor: "white",
                    borderRadius: 20,
                    marginHorizontal: 10,
                  },
                  row: {
                    backgroundColor: "#fff",
                    padding: 13,
                    height: 44,
                    flexDirection: "row",
                  },
                  separator: {
                    height: 0.5,
                    backgroundColor: "#c8c7cc",
                  },
                  description: {
                    fontSize: 15,
                    color: "#000",
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
                    image={greenmarker4}
                    draggable
                    coordinate={marker}
                    onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
                  />
                )}
  
                {optimizedRoute && (markersWithOrder.map((marker, index) => (
                    <CustomMarker
                      key={index}
                      coordinate={marker}
                      order={marker.order}
                    />
                  )))}
  
                { markers.map((location, index) => (
                  <Marker
                    image={greenmarker4}
                    key={`marker-${index}-${location.latitude}-${location.longitude}`}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title={location.name}
                    
                  />
                ))}
                {optimizedRoute && (
                  <MapViewDirections
                    // origin={optimizedRoute[0]}
                    origin={location}
                    destination={optimizedRoute[optimizedRoute.length - 1]}
                    waypoints={optimizedRoute.slice(1, -1)}
                    apikey={API_KEY}
                    strokeWidth={3}
                    strokeColor="black"
                    optimizeWaypoints={optimizeWayPoints}
                    // resetOnChange={false}
                    onStart={(params) => {
                      console.log(
                        `Started routing between "${params.origin}" and "${params.destination}"`
                      );
                    }}
                    onReady={(result) => {
                      console.log(`Distance: ${result.distance} km`);
                      console.log(`Duration: ${result.duration} min.`);
                      // mapRef.current.fitToCoordinates(result.coordinates,{
                      //   edgePadding:{
                      //     right:30,
                      //     bottom:300,
                      //     left:30,
                      //     top:100
                      //   }
                      // })
                    }}
                    onError={(errorMessage) => {
                      console.error(errorMessage);
                    }}
                  />
                )}
              </MapView>
              {showConfirmButton && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.confirminBut}
                    onPress={handleConfirmLocation}
                  >
                    <View>
                      <Text style={styles.textSign}>CONFIRM LOCATION</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {directionsModalVisible ? (
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={handleTextDirectons}
                >
                  <FontAwesome5 name="directions" size={24} color="white" />
                </TouchableOpacity>
              ) : null}
              {locations.length > 0 ? (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handlePresentModalPress}
                >
                  <Ionicons name="person" size={24} color="white" />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={handleCurrentLocation}
              >
                <FontAwesome6
                  name="location-crosshairs"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <BottomSheetModal
            backgroundStyle={{backgroundColor:'#FFF6E9'}}
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text style={styles.sheetTitle}>SAVED LOCATIONS</Text>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {locations.map((location, index) => (
                  <View style={{flexDirection:'row'}} key={index}>
                    <View style={{marginTop:5,marginRight:-5}}>
                    <TouchableOpacity>
                    <MaterialIcons name="delete" size={24} color="black" style={{marginEnd:10}} onPress={()=>handleDeleteCustomer(location.latitude,location.longitude)} />
                    </TouchableOpacity>
                    </View>
                  <View  style={styles.locationItem}>
                    <Text style={styles.locationText}>NAME: {location.name}</Text>
                    <Text style={styles.locationText}>
                      PHONE: {location.phoneNumber}
                    </Text>
                    <Text
                      style={styles.locationText}
                    >{`${location.time}`}</Text>
                  </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.buttonGroup}>
              <TouchableOpacity
                    style={styles.bottominBut}
                    onPress={handleSaveRoute}
                  >
                    <View>
                      <Text style={styles.textSign}>SAVE ROUTE</Text>
                    </View>
                  </TouchableOpacity>
              <TouchableOpacity
                    style={styles.bottominBut}
                    onPress={handleGetDirections}
                  >
                    <View>
                      <Text style={styles.textSign}>GET DIRECTIONS</Text>
                    </View>
                  </TouchableOpacity>
                {/* <Button title="Save Route" onPress={handleSaveRoute} /> */}
                {/* <Button title="Get Directions" onPress={handleGetDirections} /> */}
              </View>
            </BottomSheetView>
          </BottomSheetModal>
         {textualDirections && (<BottomSheetModal
    backgroundStyle={{ backgroundColor: "#FFF6E9" }}
    ref={directionsModalRef}
  
    snapPoints={["10%", "50%"]}
    dismissOnPanDown={true}
    onChange={(index) => {
      if (index === -1) {
        setTextualDirections([]);
      }
    }}
  >
    <BottomSheetView style={styles.contentContainer}>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity
          style={styles.bottominBut2}
          
            onPress={tracking ? stopTracking : startTracking}
        >
          <View>
            <Text style={styles.textSign}>{tracking ? "Stop Tracking" : "Get Started"}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottominBut2}
          onPress={handleSMS}
        >
          <View>
            <Text style={styles.textSign}>SEND SMS</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <Button onPress={handleSMS} title="send sms"></Button> */}
      <Text style={styles.sheetTitle}>TEXTUAL DIRECTIONS</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {textualDirections.map((leg, index) => (
          <View key={index} style={styles.heading}>
            <View style={{margin:2}}>
            <Text style={styles.Text1}>
              Source:
            </Text>
            <Text style={styles.box}>
              {leg.start_address}
            </Text>
            </View>
            <View style={{margin:2}}>
              <Text style={styles.Text1}>
                Destination:
              </Text>
              <Text style={styles.box}>
                {leg.end_address}
              </Text>
            </View>
            <View style={{flexDirection:'row',margin:2}}>
              <Text style={styles.Text1}>
                Distance: 
              </Text>
              <Text style={{textAlignVertical:'center',margin:2}}>
                {leg.distance.text}
              </Text>
            </View>
            <View style={{flexDirection:'row',margin:2}}>
              <Text style={styles.Text1}>
                Duration: 
              </Text>
              <Text style={{textAlignVertical:'center', margin:2}}>
              {leg.duration.text}
              </Text>
            </View>
            <Text style={styles.Text1}>
              Steps:
            </Text>
            {leg.steps.map((step, stepIndex) => (
              <View style={styles.box} key={stepIndex}>
              <Text >
                {step.html_instructions.replace(/<[^>]*>/g, "")}
              </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </BottomSheetView>
  </BottomSheetModal>)}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.modalView}>
                {/* <Text style={{fontSize:20}}>Customer Details</Text> */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
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
                {/* <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.timeText}>
                    START TIME: {formatTime(startTime)}
                  </Text>
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
                )} */}
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.timeText}>
                    END TIME: {formatTime(endTime)}
                  </Text>
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
                <View style={styles.loginbutton}>
                  <TouchableOpacity
                    style={styles.inBut}
                    onPress={handleSubmit}
                  >
                    <View>
                      <Text style={styles.textSign}>SUBMIT</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      position: "absolute",
      bottom: 10,
      left: "25%",
      right: "25%",
    },
    box:{
      borderWidth:1,
      padding:5,
      margin:2,
      borderRadius:10,
      backgroundColor:'#fff',
      borderColor:'#34A751'
    },
    heading:{
      // margin:5
    },
    currentLocationButton: {
      position: "absolute",
      bottom: 40,
      right: 20,
      backgroundColor: "#34A751",
      padding: 15,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    modalButton: {
      position: "absolute",
      bottom: 110,
      right: 20,
      backgroundColor: "#34A751",
      padding: 15,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    directionsButton: {
      position: "absolute",
      bottom: 180,
      right: 20,
      backgroundColor: "#34A751",
      padding: 15,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      padding:1,
      alignItems: "center",
      justifyContent: "center",
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    scrollViewContent: {
      paddingBottom: 20,
      paddingHorizontal:10,
      flexGrow:1
    },
    locationItem: {
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor:'#fff'
    },
    locationText: {
      fontSize: 16,
    },
    Text1: {
      fontSize: 16,
      fontWeight:'600'
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 20,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      width: "90%",
      backgroundColor: "white",
      borderRadius: 15,
      paddingVertical: 70,
      paddingHorizontal: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    inBut: {
      marginTop:10,
      marginBottom:-10,
      width: '60%',
      backgroundColor: '#34A751',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
      alignSelf:'center'
    },
    bottominBut: {
      width: '40%',
      backgroundColor: '#34A751',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf:'center',
      marginBottom:10
    },
    bottominBut2: {
      width:'30%',
      backgroundColor: '#34A751',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf:'center',
      marginBottom:10,
      marginHorizontal:20
    },
    confirminBut: {
      width: '100%',
      backgroundColor: '#34A751',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf:'center'
    },
    textSign: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
    },
    input: {
      height: 45,
      borderColor: "gold",
      borderRadius: 10,
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 10,
      width: "100%",
    },
    timeText: {
      marginVertical: 5,
      fontSize: 16,
      color: "grey",
      textAlign: "center",
    },
    orderMarker: {
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'black',
    },
    orderText: {
      fontWeight: 'bold',
      color: 'black',
    },
  });
  
  export default ShowOnMapDeadLine;
  