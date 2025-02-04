import { Stack, Tabs, Navigator } from "expo-router";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs>
        <Tabs.Screen name= 'userdashboard'   
        options={{
          headerShown: false,
        headerLeft:()=> <></>,
        tabBarIcon: ({focused, color, size}) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color}/>
        )
        }}/>
        <Tabs.Screen name= 'CameraScreen' 
          options={{
         
          headerLeft:()=> <></>,
          tabBarIcon: ({focused, color, size}) => (
            <Ionicons name="camera-outline" size={32}  color={color}  />
         )       }}/>
        
        {/* <Tabs.Screen name= 'evaluate'   
        options={{
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => (
          <Ionicons name="code-slash" size={32}  color={color} />
        )
      
        }}/> */}
          <Tabs.Screen name= 'profile' 
      options={{
        headerShown: false,
        headerLeft:()=> <></>,
        tabBarIcon: ({focused, color, size}) => (
          <Ionicons name="person" size={32}  color={color}  />
        )
      


        }}/>
        
    </Tabs>
  
  );
}
