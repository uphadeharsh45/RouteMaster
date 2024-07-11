import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Modal, Button, Switch } from 'react-native';
import { DataTable } from 'react-native-paper';
import routeContext from '../context/routes/routeContext';
import { FontAwesome5, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const SavedRoutes = () => {
  const navigation = useNavigation();
  const context = useContext(routeContext);
  const { twroutes, getalltwroutes, deleteTWRoute, deleteTWCustomer, updateTWTime, routes, getallroutes, deleteRoute, deleteCustomer, updateTime } = context;

  const [modalVisible, setModalVisible] = useState(false);
  const [currentRouteId, setCurrentRouteId] = useState(null);
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [newStartTime, setNewStartTime] = useState(new Date());
  const [newEndTime, setNewEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [deadline, setDeadline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getalltwroutes();
        await getallroutes();
        console.log('Fetched TW routes:', twroutes);
        console.log('Fetched all deadline routes:', routes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditPress = (routeId, locationId, startTime, endTime) => {
    setCurrentRouteId(routeId);
    setCurrentLocationId(locationId);
    setNewStartTime(new Date(`1970-01-01T${startTime}:00`));
    setNewEndTime(new Date(`1970-01-01T${endTime}:00`));
    setModalVisible(true);
  };

  const handleDeadlineEditPress = (routeId, locationId, deadlineTime) => {
    setCurrentRouteId(routeId);
    setCurrentLocationId(locationId);
    setNewEndTime(new Date(`1970-01-01T${deadlineTime}:00`));
    setModalVisible(true);
  };

  const handleTimeChange = (event, selectedDate, isStartTime) => {
    if (selectedDate) {
      if (isStartTime) {
        setNewStartTime(selectedDate);
      } else {
        setNewEndTime(selectedDate);
      }
    }
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const formatTime = (date) => {
    return date.toTimeString().split(' ')[0].slice(0, 5); // Extract hours and minutes
  };

  const handleConfirm = () => {
    if (deadline) {
      updateTime(currentRouteId, currentLocationId, formatTime(newEndTime));
    } else {
      updateTWTime(currentRouteId, currentLocationId, formatTime(newStartTime), formatTime(newEndTime));
    }
    setModalVisible(false);
    Toast.show({
      type: "success",
      text1: "Time Updated Successfully",
      visibilityTime: 5000,
    });
  };

  const handleShowOnMap = (routeId, locations) => {
    navigation.navigate('ShowOnMapTW', { routeId, locations });
  };
  const handleShowOnMapDL = (routeId, locations) => {
    navigation.navigate('ShowOnMapDeadLine', { routeId, locations });
  };

  const routesToDisplay = deadline ? routes : twroutes;

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor='#34A751' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.nameText}>Saved Routes</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', margin: 12 }}>{deadline ? "Deadline Routes" : "Time Window Routes"}</Text>
        <Switch
          trackColor={{ true: '#15e64a' }}
          thumbColor={deadline ? '#34A751' : '#fff'}
          onValueChange={() => { setDeadline(!deadline) }}
          value={deadline}
        />
      </View>
      <ScrollView style={styles.container}>
        {routesToDisplay && routesToDisplay.length > 0 ? (
          routesToDisplay.map((route, index) => (
            <View key={route._id}>
              <View style={styles.tableHeaderText}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginEnd: 10 }}>ROUTE {index + 1}</Text>
                <TouchableOpacity onPress={() => { { deadline ? deleteRoute(route._id) : deleteTWRoute(route._id) }; Toast.show({
                  type: "success",
                  text1: "Deleted Route Successfully",
                  visibilityTime: 5000,
                }); }}>
                  <MaterialIcons name="delete" size={24} color="black" style={{ marginEnd: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {{deadline?handleShowOnMapDL(route._id,route.locations):handleShowOnMap(route._id, route.locations)}}}>
                  <FontAwesome5 name="map-marked-alt" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <DataTable style={styles.container2}>
                {deadline ? (
                  <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={{ margin: -25 }}>  </DataTable.Title>
                    <DataTable.Title style={{ margin: -40 }}>  </DataTable.Title>
                    <DataTable.Title textStyle={{ color: 'white' }}>Name</DataTable.Title>
                    <DataTable.Title textStyle={{ color: 'white' }}>Deadline</DataTable.Title>
                  </DataTable.Header>
                ) : (
                  <>
                    <DataTable.Header style={styles.tableHeader}>
                      <DataTable.Title style={{ margin: -25 }}>  </DataTable.Title>
                      <DataTable.Title style={{ margin: -25 }}>  </DataTable.Title>
                      <DataTable.Title textStyle={{ color: 'white' }}>Name</DataTable.Title>
                      <DataTable.Title textStyle={{ color: 'white' }}>Start Time</DataTable.Title>
                      <DataTable.Title textStyle={{ color: 'white' }}>End Time</DataTable.Title>
                    </DataTable.Header>
                  </>
                )}
                {route.locations.map((location) => (
                  <DataTable.Row key={location._id}>
                    <DataTable.Cell style={deadline ? styles.iconsclose : styles.iconsfar}>
                      <TouchableOpacity onPress={() => { { deadline ? deleteCustomer(route._id, location._id) : deleteTWCustomer(route._id, location._id) }; Toast.show({
                        type: "success",
                        text1: "Deleted Customer Successfully",
                        visibilityTime: 5000,
                      }); }}>
                        <MaterialIcons name="delete" size={20} color="black" style={{ marginEnd: 10 }} />
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ marginEnd: -40, marginLeft: -10 }}>
                      <TouchableOpacity onPress={() => deadline ? handleDeadlineEditPress(route._id, location._id, location.time) : handleEditPress(route._id, location._id, location.startTime, location.endTime)}>
                        <Feather name="edit" size={17} color="black" />
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell>{location.name}</DataTable.Cell>
                    {deadline ? (
                      <DataTable.Cell>{location.time}</DataTable.Cell>
                    ) : (
                      <>
                        <DataTable.Cell>{location.startTime}</DataTable.Cell>
                        <DataTable.Cell>{location.endTime}</DataTable.Cell>
                      </>
                    )}
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No routes available</Text>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Entypo name="cross" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>EDIT TIME</Text>
            {!deadline && (
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Text style={styles.timeText}>START TIME: {formatTime(newStartTime)}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text style={styles.timeText}>{deadline ? 'Deadline Time' : 'END TIME'}: {formatTime(newEndTime)}</Text>
            </TouchableOpacity>
            <View style={styles.loginbutton}>
                <TouchableOpacity
                  style={styles.inBut}
                  onPress={handleConfirm}
                >
                  <View>
                    <Text style={styles.textSign}>SUBMIT</Text>
                  </View>
                </TouchableOpacity>
              </View>
            {/* <Button title="Confirm" onPress={handleConfirm} /> */}
            {/* <Button title="Cancel" onPress={() => setModalVisible(false)} /> */}
          </View>
        </View>
      </Modal>

      {showStartPicker && (
        <DateTimePicker
          value={newStartTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => handleTimeChange(event, selectedDate, true)}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={newEndTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => handleTimeChange(event, selectedDate, false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFF6E9',
  },
  header: {
    backgroundColor: '#34A751',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 20,
  },
  container2: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  tableContainer: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#34A751',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  tableHeader: {
    backgroundColor: '#34A751',
    height: 45,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
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
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop:-20,
    textAlign:'center',
    color:'#34A751'
  },
  timeText: {
    marginVertical: 5,
    fontSize: 16,
    color: "grey",
    textAlign: "center",
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
  iconsclose: {
    marginEnd: -67,
    marginLeft: -10
  },
  iconsfar: {
    marginEnd: -40,
    marginLeft: -10
  },
  textSign: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SavedRoutes;
