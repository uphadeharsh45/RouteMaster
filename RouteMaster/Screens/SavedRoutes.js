import React from 'react'
import { useContext } from 'react';
import { useState,useEffect } from 'react';
import routeContext from '../context/routes/routeContext';
import { StyleSheet, Text, View,Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';



const SavedRoutes = () => {

  const context = useContext(routeContext);
  const { twroutes,getalltwroutes } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        
          await getalltwroutes();
          console.log(twroutes);
        
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(twroutes);
  }, [twroutes]);


  return (
    <View style={styles.main}>
        <Text>This is SavedRoutes</Text>
    </View>
  )
}


const styles=StyleSheet.create({
    main:{
        flex:1
    }
})

export default SavedRoutes
