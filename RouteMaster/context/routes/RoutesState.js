import React from 'react'
import routeContext from "./routeContext";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';



const RoutesState = (props) => {
    const host = process.env.EXPO_PUBLIC_API_URL;
    const twroutesInitial = []
    const [twroutes, setTWRoutes] = useState(twroutesInitial)

    const getalltwroutes = async () => {
      const token= await AsyncStorage.getItem('token');
      const response = await fetch(`${host}/api/routes/fetchalltwroutes`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
  
        headers: {
          "Content-Type": "application/json",
          "auth-token":token
        }
      });
      const json = await response.json();
    //   console.log(json);
      setTWRoutes(json);
      console.log(twroutes)
    };






 
    
   
    


  return (
    <routeContext.Provider value={{ twroutes, getalltwroutes }}>
      {props.children}
    </routeContext.Provider>
  )
}

export default RoutesState
