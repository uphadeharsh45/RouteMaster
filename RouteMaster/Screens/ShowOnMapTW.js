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
    FlatList
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
import * as Contacts from 'expo-contacts';

  
  
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  const ShowOnMapTW = () => {
    const route = useRoute();
    const context = useContext(routeContext);
    const { updateTWRoute } = context;
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
  const [routeInfo,setRouteInfo]=useState([]);
  const [presentTime, setPresentTime] = useState(new Date());
  const [RouteFound,setRouteFound]=useState(true);
  const [cumulativeTime, setCumulativeTime] = useState(0);
  const [loading, setLoading] = useState(false); // Added loading state
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [waitTime,setWaitTime]=useState(null);


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
  
    useEffect(() => {
      const fetchContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          });
          setContacts(data);
        }
      };
  
      fetchContacts();
    }, []);
  
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
            const { waitTime } = result.data;
          setWaitTime(waitTime);
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

    const handleContactSelect = (contact) => {
      setUserName(contact.name);
      if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        setUserMobile(contact.phoneNumbers[0].number);
      }
      setContactModalVisible(false);
    };
  
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(search.toLowerCase())
    );
    
  
    
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
      Toast.show({
        type: "success",
        text1: "Customer Deleted Successfully",
        // text2: "Showing shortest possible path",
        visibilityTime: 5000,
      });
      // Remove the corresponding marker from the markers array
      // setMarkers([]);
      
    };

    function extractNumberFromDurationText(duration) {
      // Use a regular expression to extract the number part
      // const match = durationText.match(/\d+/);
      // return match ? Number(match[0]) : 0;
      let totalMinutes = 0;
    
    const hoursMatch = duration.match(/(\d+)\s*hour/);
    if (hoursMatch) {
      totalMinutes += parseInt(hoursMatch[1]) * 60;
    }
  
    const minutesMatch = duration.match(/(\d+)\s*min/);
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[1]);
    }
  
    return totalMinutes;
    }
  
    const fetchTextualDirections = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${optimizedRoute[0].latitude},${optimizedRoute[0].longitude}&destination=${optimizedRoute[optimizedRoute.length - 1].latitude},${optimizedRoute[optimizedRoute.length - 1].longitude}&waypoints=${optimizedRoute
            .slice(1, -1)
            .map(
              (coordinate) =>
                `${coordinate.latitude},${coordinate.longitude}`
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
      if(locations.length===24)
        {
          Toast.show({
            type: "error",
            text1: "Max Limit Reached !",
            text2: "You cannot enter more than 24 locations",
            visibilityTime: 5000,
          });
          return;
        }
      if(startTime>endTime )
      {
        Toast.show({
          type: "error",
          text1: "Invalid time window",
          text2: "End time cannot be less than start time",
          visibilityTime: 5000,
        });
        return;
      }
      if(userMobile.length!==10)
      {
        
        Toast.show({
          type: "error",
          text1: "Invalid Phone number",
          text2: "Phone number should consist of exactly 10 digits",
          visibilityTime: 5000,
        });
        return;
      }
     
      if (userName && userMobile && startTime && endTime) {
        const newLocation = {
          name: userName,
          phoneNumber: userMobile,
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
          latitude: marker.latitude,
          longitude: marker.longitude,
        };
        setLocations([...locations, newLocation]);
        setMarkers(prevMarkers => [...prevMarkers,{name:userName, latitude:marker.latitude, longitude: marker.longitude } ]);
        setMarker(null);
        setModalVisible(false);
        setShowConfirmButton(false);
        setUserMobile("");
        setUserName("");
        Alert.alert(
          "Location Confirmed",
          `Name: ${userName}\nMobile: ${userMobile}\nDelivery Time: ${formatTime(
            startTime
          )} - ${formatTime(endTime)}`
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
  
    const handleUpdateRoute = async () => {
  
      try {
        await updateTWRoute(route.params.routeId,locations)

        Toast.show({
          type: "success",
          text1: "Route saved successfully",
          // text2: "Showing shortest possible path",
          visibilityTime: 5000,
        });
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

    const getFormattedTime = (minutes) => {
      const date = new Date(presentTime.getTime() + minutes * 60000);
      const hours = date.getHours().toString().padStart(2, '0');
      const mins = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${mins}`;
    };
  
    const handleGetDirections = async () => {
      setLoading(true); // Show loader

      const latLongArray = locations.map((location) => ({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
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
          "23:24", // Current time + 3 hours
        ],
        ...locations.map((location) => [
          removeLeadingZeros(location.startTime),
          removeLeadingZeros(location.endTime),
        ]),
      ];
  
      console.log("Latitude and Longitude Array:", latLongArray);
      console.log("Time Windows Array:", timeWindows);
  
      const requestData = {
        locations: latLongArray,
        timeWindows: timeWindows,
        numVehicles: 1,
        startTime: currentFormattedTime,
        waitTime:waitTime

      };
      try {
        const response = await fetch(`${apiUrl}/get-travel-times`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,

        });
        clearTimeout(timeoutId);

        const data = await response.json();
        if (!data) {
          // If data is null, show a toast and fetch shortest path using Directions API
          
  
          // Use latLongArray since optimizedRoute is null
          const waypoints = latLongArray
              .slice(1) // Exclude the first point which is the origin
              .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
              .join("|");
  
          // Call Directions API for shortest path
          const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${latLongArray[0].latitude},${latLongArray[0].longitude}&destination=${latLongArray[0].latitude},${latLongArray[0].longitude}&waypoints=optimize:true|${waypoints}&key=${API_KEY}`;
  
          try {
              const response = await fetch(url);
              const data = await response.json();
  
              if (!data.routes || data.routes.length === 0) {
                  throw new Error("No routes found in Directions API response");
              }
  
              // Extract optimized route from Directions API response
              const newOptimizedRoute = data.routes[0].waypoint_order.map(index => latLongArray[index + 1]);
  
              // Update optimizedRoute state with the new optimized path
              setOptimizedRoute([latLongArray[0], ...newOptimizedRoute]); // Destination set to origin
              
              const newarr=[latLongArray[0], ...newOptimizedRoute];
              setRouteFound(false);
              
                const markersWithOrder1 = newarr.map((coordinate, index) => ({
                  ...coordinate,
                  order: index + 1, // Add order property
                }));
                clearMarkers();
                setMarkersWithOrder(markersWithOrder1);
  
              // Additional logic if needed based on the fetched data
          } catch (error) {
              console.error("Error fetching shortest path:", error);
              Toast.show({
                  type: "error",
                  text1: "Error fetching shortest path",
                  visibilityTime: 5000,
              });
          }
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
          const routeDetails = [];
        setRouteFound(true);
        const optimizedRouteCoordinates = data[0]
        .map((location) => {
          // Push an object containing index, arrival time, and departure time to the routeDetails array
          routeDetails.push({
            index: location.index,
            arrival_time: location.arrival_time,
            departure_time: location.departure_time,
          });
          // Return the coordinates for the current location index
          return latLongArray[location.index];
        })
        .slice(0, -1);
            // Store the optimized route coordinates
            setOptimizedRoute(optimizedRouteCoordinates);
            setRouteInfo(routeDetails);
      
  
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
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          Toast.show({
            type: "error",
            text1: "Request timed out",
            visibilityTime: 5000,
          });
        } else {
          console.error("Error fetching optimized route:", error);
          Toast.show({
            type: "error",
            text1: "Error fetching optimized route",
            visibilityTime: 5000,
          });
        }
      }finally{
        setLoading(false);
        setPresentTime(new Date());

      }
    };
  
    const calculateETA = (startTime, durationInSeconds) => {
      const startTimeInMillis = startTime.getTime();
      const estimatedTimeInMillis = startTimeInMillis + durationInSeconds * 1000;
      const estimatedTime = new Date(estimatedTimeInMillis);
      return estimatedTime;
    };
  
    function getFormattedTimeSMS(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
  }
  
  
  const handleSMS = async () => {
    try {
        let legs = [];

        // Check if route is found and use routeInfo for legs
       
            // Build legs from optimizedRoute
            const waypoints = optimizedRoute
                .slice(1, -1)
                .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
                .join("|");

            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${optimizedRoute[0].latitude},${optimizedRoute[0].longitude}&destination=${optimizedRoute[optimizedRoute.length - 1].latitude},${optimizedRoute[optimizedRoute.length - 1].longitude}&waypoints=${waypoints}&key=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.routes || data.routes.length === 0) {
                throw new Error("No routes found in Directions API response");
            }

            legs = data.routes[0].legs;
        

        // Create a map to link optimized route locations with the original locations' phone numbers, excluding the starting location
        const locationMap = new Map();
        locations.forEach((location) => {
            const key = `${location.latitude.toFixed(6)},${location.longitude.toFixed(6)}`;
            locationMap.set(key, location.phoneNumber);
        });

        console.log("Location Map:", locationMap);

        let accumulatedTime = presentTime.getTime(); // Start with current time in milliseconds
        Toast.show({
          type: "success",
          text1: "Sending SMS",
          // text2: "Showing shortest possible path",
          visibilityTime: 5000,
        });
        for (let i = 0; i < legs.length; i++) {
            const leg = legs[i];
            const durationInSeconds = leg.duration.value;

            let arrivalTime, departureTime, index;

            // Determine arrival and departure times based on routeFound state
            if (RouteFound && routeInfo.length > 0) {
                arrivalTime = presentTime.getTime() + (routeInfo[i+1].arrival_time * 60 * 1000); // Convert minutes to milliseconds
                departureTime = presentTime.getTime() + (routeInfo[i].departure_time * 60 * 1000); // Convert minutes to milliseconds
                index = routeInfo[i].index;
            } else {
                arrivalTime = accumulatedTime + durationInSeconds * 1000; // Estimated arrival time
                departureTime = accumulatedTime + durationInSeconds * 1000 + 5 * 60 * 1000; // Estimated departure time (5 minutes after arrival)
                index = i;
            }

            const latLng = `${optimizedRoute[i + 1].latitude.toFixed(6)},${optimizedRoute[i + 1].longitude.toFixed(6)}`;
            const phoneNumber = '+91' + locationMap.get(latLng);

            const msg = `Your delivery time is ${getFormattedTimeSMS(arrivalTime)}`;
            console.log("Sending SMS:", msg, "to", phoneNumber);

            if (phoneNumber) {
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds between SMS sends
                await SMS(phoneNumber, msg);
            }

            if (!RouteFound) {
              accumulatedTime += durationInSeconds * 1000+waitTime*60*1000;// Update accumulated time to include current leg's duration
            }
        }
        Toast.show({
          type: "success",
          text1: "SMS sent successfully",
          // text2: "Showing shortest possible path",
          visibilityTime: 5000,
        });
    } catch (error) {
        console.error("Error fetching textual directions:", error);
    }
};
    
    
  
    const renderItem = ({ item }) => (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.phoneNumber}</Text>
        <Text style={styles.cell}>{`${item.startTime} - ${item.endTime}`}</Text>
      </View>
    );
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
                    >{`${location.startTime} - ${location.endTime}`}</Text>
                  </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.buttonGroup}>
              <TouchableOpacity
                    style={styles.bottominBut}
                    onPress={handleUpdateRoute}
                  >
                    <View>
                      <Text style={styles.textSign}>SAVE ROUTE</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={styles.bottominBut}
                  onPress={handleGetDirections}
                >
                  
                  {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Show loader
          ) : (
            <Text style={styles.textSign}>GET DIRECTIONS</Text>
          )}                  
                </TouchableOpacity>
                {/* <Button title="Save Route" onPress={handleUpdateRoute} /> */}
                {/* <Button title="Get Directions" onPress={handleGetDirections} /> */}
              </View>
            </BottomSheetView>
          </BottomSheetModal>
         {textualDirections && (<BottomSheetModal
    backgroundStyle={{ backgroundColor: "#FFF6E9" }}
    ref={directionsModalRef}
  
    snapPoints={["10%", "50%","75%"]}
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
        {textualDirections.map((leg, index) => {
          const currentPoint = RouteFound ? routeInfo[index] : null;
          const nextPoint = RouteFound ? routeInfo[index + 1] : null;
          
          const sourceIndex =`Point ${index + 1}` ;
          const destinationIndex = `Point ${index + 2}` ;
          const duration = leg.duration.text
           
          const expectedArrivalTime = RouteFound
            ? getFormattedTime(nextPoint.arrival_time)
            : getFormattedTime(
                index === 0
                  ? extractNumberFromDurationText(leg.duration.text)
                  : extractNumberFromDurationText(leg.duration.text) + 5
              );

          return (
            <View key={index} style={styles.heading}>
              <View style={{ margin: 2 }}>
                <Text style={styles.Text1}>Source: {sourceIndex}</Text>
              </View>
              <View style={{ margin: 2 }}>
                <Text style={styles.Text1}>Destination: {destinationIndex}</Text>
              </View>
              <View style={{ flexDirection: 'row', margin: 2 }}>
                <Text style={styles.Text1}>Distance:</Text>
                <Text style={{ textAlignVertical: 'center', margin: 2 }}>
                  {leg.distance.text}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', margin: 2 }}>
                <Text style={styles.Text1}>Duration:</Text>
                <Text style={{ textAlignVertical: 'center', margin: 2 }}>
                  {duration} 
                </Text>
              </View>
              {RouteFound && (
                <View style={{ margin: 2 }}>
                  <Text style={styles.Text1}>
                    Expected Departure from {sourceIndex}:
                  </Text>
                  <Text style={styles.box}>
                    {currentPoint.index !== 0
                      ? getFormattedTime(nextPoint.arrival_time -
                        extractNumberFromDurationText(leg.duration.text) )
                      : getFormattedTime(
                          nextPoint.arrival_time -
                            extractNumberFromDurationText(leg.duration.text)
                        )}
                  </Text>
                </View>
              )}
             {RouteFound && <View style={{ margin: 2 }}>
                <Text style={styles.Text1}>
                  Expected Arrival at {destinationIndex}:
                </Text>
                <Text style={styles.box}>{expectedArrivalTime}</Text>
              </View>}
              {RouteFound && currentPoint.departure_time !== currentPoint.arrival_time && (
                <View style={{ margin: 2 }}>
                  <Text style={styles.Text1}>
                    Extra Time Needed to be Waited at {sourceIndex}:
                  </Text>
                  <Text style={styles.box}>
                    { nextPoint.arrival_time-extractNumberFromDurationText(leg.duration.text)-currentPoint.arrival_time-waitTime} min
                  </Text>
                </View>
              )}
              <Text style={styles.Text1}>Steps:</Text>
              {leg.steps.map((step, stepIndex) => (
                <View style={styles.box} key={stepIndex}>
                  <Text>{step.html_instructions.replace(/<[^>]*>/g, "")}</Text>
                </View>
              ))}
            </View>
          );
        })}
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
          <TouchableOpacity onPress={() => setContactModalVisible(true)}>
            <Text style={styles.contactPickerText}>Select from Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
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
          )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => {
          setContactModalVisible(!contactModalVisible);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.contactModalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setContactModalVisible(!contactModalVisible)}
            >
              <Entypo name="cross" size={30} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Search Contacts"
              value={search}
              onChangeText={setSearch}
            />
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleContactSelect(item)}>
                  <View style={styles.contactItem}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                      <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
      backgroundColor:'#fff',
      width:'89%'
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
    contactItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    contactName: {
      fontSize: 16,
    },
    contactNumber: {
      fontSize: 14,
      color: 'gray',
    },
    contactPickerText: {
      color: '#34A751',
      marginBottom: 20,
      textAlign: 'center',
    },
    contactModalView: {
      width: '90%',
      height: '80%',
      backgroundColor: 'white',
      borderRadius: 15,
      paddingVertical: 40,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      position: 'relative',
    },
  });
  
  export default ShowOnMapTW;
  