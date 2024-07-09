import React from 'react'
import routeContext from "./routeContext";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';



const RoutesState = (props) => {
    const host = process.env.EXPO_PUBLIC_API_URL;
    const twroutesInitial = []
    const [twroutes, setTWRoutes] = useState(twroutesInitial)
    const routesInitial = []
    const [routes, setRoutes] = useState(routesInitial)

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

    const deleteTWRoute = async (id) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/deletetwroute/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete route');
        }
    
        console.log('Route deleted successfully:', data.route);
        // return data.route; 
        // Return the deleted route data if needed
      } catch (error) {
        console.error('Error deleting route:', error);
        // Handle error
      }

      const newRoutes = twroutes.filter((route) => {
        return route._id !== id;
      })
      setTWRoutes(newRoutes);
    };

    const deleteTWCustomer = async (routeId, customerId) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/deletetwcustomer/${routeId}/${customerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token // Assuming you're using token-based authentication
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete customer');
        }

           // Update the frontend state to reflect the changes
     setTWRoutes(prevRoutes => {
      const updatedRoutes = prevRoutes.map(route => {
        if (route._id === routeId) {
          // Filter out the deleted customer from the locations array
          route.locations = route.locations.filter(customer => customer._id !== customerId);
        }
        return route;
      });
      return updatedRoutes;
    });
    
        console.log('Customer deleted successfully');
        // Return any necessary data or handle success
      } catch (error) {
        console.error('Error deleting customer:', error);
        // Handle error
      }
    };

    const updateTWTime = async (routeId, customerId, newStartTime,newEndTime) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/updatetwtime/${routeId}/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token // Assuming you're using token-based authentication
          },
          body: JSON.stringify({ newStartTime,newEndTime }) // Send the new time in the request body
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update customer');
        }
    
        // Update the frontend state to reflect the changes
        setTWRoutes(prevRoutes => {
          const updatedRoutes = prevRoutes.map(route => {
            if (route._id === routeId) {
              // Update the time of the specific customer
              route.locations = route.locations.map(customer => {
                if (customer._id === customerId) {
                  return { ...customer, startTime: newStartTime,endTime:newEndTime };
                }
                return customer;
              });
            }
            return route;
          });
          return updatedRoutes;
        });
    
        console.log('Customer updated successfully');
        // Return any necessary data or handle success
      } catch (error) {
        console.error('Error updating customer:', error);
        // Handle error
      }
    };

    const updateTWRoute = async (id, newLocations) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/updatetwroute/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token // Assuming you're using token-based authentication
          },
          body: JSON.stringify({ newLocations })
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update route');
        }
    
        console.log('Route updated successfully:', data.route);
        // return data.route; 
        // Return the updated route data if needed
      } catch (error) {
        console.error('Error updating route:', error);
        // Handle error
      }
    };



    const getallroutes = async () => {
      const token= await AsyncStorage.getItem('token');

      const response = await fetch(`${host}/api/routes/fetchallroutes`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
  
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      const json = await response.json();
    //   console.log(json);
      setRoutes(json);
    };
    

    const deleteRoute = async (id) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/deleteroute/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete route');
        }
    
        console.log('Route deleted successfully:', data.route);
        // return data.route; 
        // Return the deleted route data if needed
      } catch (error) {
        console.error('Error deleting route:', error);
        // Handle error
      }

      const newRoutes = routes.filter((route) => {
        return route._id !== id;
      })
      setRoutes(newRoutes);
    };
   

    const deleteCustomer = async (routeId, customerId) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/deletecustomer/${routeId}/${customerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token// Assuming you're using token-based authentication
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete customer');
        }

           // Update the frontend state to reflect the changes
     setRoutes(prevRoutes => {
      const updatedRoutes = prevRoutes.map(route => {
        if (route._id === routeId) {
          // Filter out the deleted customer from the locations array
          route.locations = route.locations.filter(customer => customer._id !== customerId);
        }
        return route;
      });
      return updatedRoutes;
    });
    
        console.log('Customer deleted successfully');
        // Return any necessary data or handle success
      } catch (error) {
        console.error('Error deleting customer:', error);
        // Handle error
      }
    };

    const updateTime = async (routeId, customerId, newTime) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/updatetime/${routeId}/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token // Assuming you're using token-based authentication
          },
          body: JSON.stringify({ newTime }) // Send the new time in the request body
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update customer');
        }
    
        // Update the frontend state to reflect the changes
        setRoutes(prevRoutes => {
          const updatedRoutes = prevRoutes.map(route => {
            if (route._id === routeId) {
              // Update the time of the specific customer
              route.locations = route.locations.map(customer => {
                if (customer._id === customerId) {
                  return { ...customer, time: newTime };
                }
                return customer;
              });
            }
            return route;
          });
          return updatedRoutes;
        });
    
        console.log('Customer updated successfully');
        // Return any necessary data or handle success
      } catch (error) {
        console.error('Error updating customer:', error);
        // Handle error
      }
    };
    
    const updateRoute = async (id, newLocations) => {
      const token= await AsyncStorage.getItem('token');

      try {
        const response = await fetch(`${host}/api/routes/updateroute/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token // Assuming you're using token-based authentication
          },
          body: JSON.stringify({ newLocations })
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update route');
        }
    
        console.log('Route updated successfully:', data.route);
        // return data.route; 
        // Return the updated route data if needed
      } catch (error) {
        console.error('Error updating route:', error);
        // Handle error
      }
    };


  return (
    <routeContext.Provider value={{ twroutes, getalltwroutes,deleteTWRoute,deleteTWCustomer,updateTWTime,updateTWRoute,routes,getallroutes,deleteRoute,deleteCustomer,updateTime,updateRoute }}>
      {props.children}
    </routeContext.Provider>
  )
}

export default RoutesState
