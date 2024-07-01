import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { DataTable } from 'react-native-paper';
import routeContext from '../context/routes/routeContext';
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';

const SavedRoutes = () => {
  const context = useContext(routeContext);
  const { twroutes, getalltwroutes } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getalltwroutes();
        console.log('Fetched routes:', twroutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{
    console.log(twroutes);
  })

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor='#34A751' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.nameText}>Saved Routes</Text>
      </View>
      <ScrollView style={styles.container}>
        {twroutes && twroutes.length > 0 ? (
          twroutes.map((route, index) => (
            <View key={route._id} >
              <View style={styles.tableHeaderText}>
              <Text style={{fontSize:18,fontWeight:'600',marginEnd:10}}>ROUTE {index + 1}</Text>
              <TouchableOpacity>
              <MaterialIcons name="delete" size={24} color="black" style={{marginEnd:10}} />
              </TouchableOpacity>
              <TouchableOpacity>
              <FontAwesome5 name="map-marked-alt" size={20} color="black" />
              </TouchableOpacity>
              </View>
              <DataTable style={styles.container2}>
                <DataTable.Header style={styles.tableHeader}>
                  <DataTable.Title style={{margin:-25}}>  </DataTable.Title>
                  <DataTable.Title style={{margin:-25}}>  </DataTable.Title>
                  <DataTable.Title textStyle={{color:'white'}}>Name</DataTable.Title>
                  {/* <DataTable.Title>Phone Number</DataTable.Title> */}
                  <DataTable.Title textStyle={{color:'white'}}>Start Time</DataTable.Title>
                  <DataTable.Title textStyle={{color:'white'}}>End Time</DataTable.Title>
                </DataTable.Header>
                {route.locations.map((location) => (
                  <DataTable.Row key={location._id}>
                    <DataTable.Cell style={{marginEnd:-40,marginLeft:-10}}>
                      <TouchableOpacity>
                      <MaterialIcons name="delete" size={20} color="black" style={{marginEnd:10}} />
                      </TouchableOpacity>
                      </DataTable.Cell>
                    <DataTable.Cell style={{marginEnd:-40,marginLeft:-10}}>
                      <TouchableOpacity>
                      <Feather name="edit" size={17} color="black" />
                      </TouchableOpacity>
                      </DataTable.Cell>
                    <DataTable.Cell>{location.name}</DataTable.Cell>
                    {/* <DataTable.Cell>{location.phoneNumber}</DataTable.Cell> */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor:'#FFF6E9',
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
    marginBottom:20
  },
  container2: {
    backgroundColor:'#fff',
    marginBottom:10,
    borderRadius:10
  },
  tableContainer: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#34A751',
    borderRadius: 5,
    padding: 10,
    backgroundColor:'#fff'
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
    flexDirection:'row',
    alignSelf:'center'
  },
  tableHeader: { 
    backgroundColor: '#34A751',
    height:45,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  }
});

export default SavedRoutes;
