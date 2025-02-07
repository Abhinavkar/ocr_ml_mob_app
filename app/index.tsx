import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import UserLogin from './UserLogin';
import UserDashboard from './(tabs)/userdashboard';
import Profile from './(tabs)/profile';
import { ThemeProvider } from './ThemeContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
 
      <Stack.Navigator initialRouteName="UserLogin">
        <Stack.Screen name="UserLogin" component={UserLogin} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
   
  </ThemeProvider>
    
  );
};

export default App;
