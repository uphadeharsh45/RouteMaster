import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Modal, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import routeContext from '../context/routes/routeContext';
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const SavedRoutes = () => {
  const navigation = useNavigation();
  const context = useContext(routeContext);
  const { twroutes, getalltwroutes, deleteTWRoute, deleteTWCustomer, updateTWTime,routes,getallroutes } = context;

  const [modalVisible, setModalVisible] = useState(false);
  const [currentRouteId, setCurrentRouteId] = useState(null);
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [newStartTime, setNewStartTime] = useState(new Date());
  const [newEndTime, setNewEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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
    updateTWTime(currentRouteId, currentLocationId, formatTime(newStartTime), formatTime(newEndTime));
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

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor='#34A751' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.nameText}>Saved Routes</Text>
      </View>
      <ScrollView style={styles.container}>
        {twroutes && twroutes.length > 0 ? (
          twroutes.map((route, index) => (
            <View key={route._id}>
              <View style={styles.tableHeaderText}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginEnd: 10 }}>ROUTE {index + 1}</Text>
                <TouchableOpacity onPress={() => { deleteTWRoute(route._id); Toast.show({
                  type: "success",
                  text1: "Deleted Route Successfully",
                  visibilityTime: 5000,
                }); }}>
                  <MaterialIcons name="delete" size={24} color="black" style={{ marginEnd: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShowOnMap(route._id, route.locations)}>
                  <FontAwesome5 name="map-marked-alt" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <DataTable style={styles.container2}>
                <DataTable.Header style={styles.tableHeader}>
                  <DataTable.Title style={{ margin: -25 }}>  </DataTable.Title>
                  <DataTable.Title style={{ margin: -25 }}>  </DataTable.Title>
                  <DataTable.Title textStyle={{ color: 'white' }}>Name</DataTable.Title>
                  <DataTable.Title textStyle={{ color: 'white' }}>Start Time</DataTable.Title>
                  <DataTable.Title textStyle={{ color: 'white' }}>End Time</DataTable.Title>
                </DataTable.Header>
                {route.locations.map((location) => (
                  <DataTable.Row key={location._id}>
                    <DataTable.Cell style={{ marginEnd: -40, marginLeft: -10 }}>
                      <TouchableOpacity onPress={() => { deleteTWCustomer(route._id, location._id); Toast.show({
                        type: "success",
                        text1: "Deleted Customer Successfully",
                        visibilityTime: 5000,
                      }); }}>
                        <MaterialIcons name="delete" size={20} color="black" style={{ marginEnd: 10 }} />
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ marginEnd: -40, marginLeft: -10 }}>
                      <TouchableOpacity onPress={() => handleEditPress(route._id, location._id, location.startTime, location.endTime)}>
                        <Feather name="edit" size={17} color="black" />
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell>{location.name}</DataTable.Cell>
                    <DataTable.Cell>{location.startTime}</DataTable.Cell>
                    <DataTable.Cell>{location.endTime}</DataTable.Cell>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Times</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text style={styles.modalText}>Start Time: {formatTime(newStartTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text style={styles.modalText}>End Time: {formatTime(newEndTime)}</Text>
            </TouchableOpacity>
            <Button title="Confirm" onPress={handleConfirm} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default SavedRoutes;
