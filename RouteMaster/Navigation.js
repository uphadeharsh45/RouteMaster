
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const TabNav = ({signOut}) => {
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={StackNav}/>
        
      <Tab.Screen name="SavedRoutes" component={SavedRoutes} />
      <Tab.Screen name="Profile">
        {props => <Profile {...props} signOut={signOut} />}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

export const StackNav = () => {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{
      statusBarColor: '#0163d2',
      headerStyle: {
        backgroundColor: '#0163d2'
      },
      headerTintColor: 'white',
      headerTitleAlign: "center",
    }}>
      <Stack.Screen name='Home' component={Home}/>
          
       <Stack.Screen name='Login' component={LoginNav} options={{ headerShown: false }} />
       <Stack.Screen name='Map1' component={Map1} options={{headerShown:false}} />
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
