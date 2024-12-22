import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserLogin from './UserLogin';
import UserDashboard from './(tabs)/userdashboard';
import CameraScreen from './(tabs)/CameraScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="UserLogin">
        <Stack.Screen name="UserLogin" component={UserLogin} options={{ headerShown: false }} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    
  );
};

export default App;