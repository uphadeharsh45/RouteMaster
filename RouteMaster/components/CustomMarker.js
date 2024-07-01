import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomMarker = ({ coordinate, order }) => (
  <Marker coordinate={coordinate}>
    <View style={styles.markerContainer}>
      <Text style={styles.markerText}>{order}</Text>
    </View>
  </Marker>
);

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomMarker;
