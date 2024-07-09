
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Screens/Home';
import Login from './Screens/Login&Register/Login';
import Register from './Screens/Login&Register/Register';
import SavedRoutes from './Screens/SavedRoutes';
import { Button } from 'react-native';
import Profile from './Screens/Profile';
import Map1 from './Screens/Map1';
import Map2 from './Screens/Map2';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import ShowOnMapTW from './Screens/ShowOnMapTW';
import ShowOnMapDeadLine from './Screens/ShowOnMapDeadLine';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const TabNav = ({signOut}) => {
  return (
    <Tab.Navigator initialRouteName='Home' 
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:'#34A751',
    }}
    >
      <Tab.Screen name="Home" component={StackNav}
        options={{
          tabBarIcon:({focused})=>(
            focused?
            <Ionicons name="home" size={24} color='#34A751' />
            :
            <Ionicons name="home-outline" size={24} color='black' />
          )
        }}/>
        
      <Tab.Screen name="SavedRoutes" component={SRStackNav} 
        options={{
          tabBarIcon:({focused})=>(
            <FontAwesome5 name="route" size={24} color={focused ? '#34A751' :'black'} />
          )
        }} />
      <Tab.Screen name="Profile" 
        options={{
          tabBarIcon:({focused})=>(
            focused?
            <FontAwesome name="user" size={24} color='#34A751' />
            :
            <FontAwesome name="user-o" size={24} color='black' />
          )
        }}>
        {props => <Profile {...props} signOut={signOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export const StackNav = () => {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{
      headerStyle: {
        backgroundColor: '#34A751'
      },
      headerTintColor: 'white',
      headerTitleAlign: "center",
    }}>
      <Stack.Screen name='Home' component={Home}/>
          
       <Stack.Screen name='Login' component={LoginNav} options={{ headerShown: false }} />
       <Stack.Screen name='Map1' component={Map1} options={{headerShown:false}} />
       <Stack.Screen name='Map2' component={Map2} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}
export const SRStackNav = () => {
  return (
    <Stack.Navigator initialRouteName='SavedRoutes' 
    // screenOptions={{
    //   headerStyle: {
    //     backgroundColor: '#34A751'
    //   },
    //   headerTintColor: 'white',
    //   headerTitleAlign: "center",
    // }}
    >
      <Stack.Screen name='SavedRoutes' component={SavedRoutes} options={{headerShown:false}}/>
          
       <Stack.Screen name='ShowOnMapTW' component={ShowOnMapTW} options={{ headerShown: false }} />
       <Stack.Screen name='ShowOnMapDeadLine' component={ShowOnMapDeadLine} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  );
}

export const LoginNav = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
    <Stack.Screen name='Login'>
        {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name='Register' component={Register}></Stack.Screen>
      <Stack.Screen name='Home' component={TabNav}></Stack.Screen>
    </Stack.Navigator>
  );
}
