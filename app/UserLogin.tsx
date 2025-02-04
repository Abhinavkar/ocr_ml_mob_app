import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminLogo from '../assets/images/blacklogo.png';
import * as ImagePicker from 'expo-image-picker';

const UserLogin = () => {

  useEffect(() => {
    function checkPermissions() {
      ImagePicker.requestCameraPermissionsAsync().then((res) => {
        console.log(res);
      }
      );
      ImagePicker.requestMediaLibraryPermissionsAsync().then((res) => {
        console.log(res);
      }
      );
      ImagePicker.getCameraPermissionsAsync().then((res) => {
        console.log(res);
      }
      );
      ImagePicker.getMediaLibraryPermissionsAsync().then((res) => {
        console.log(res);
      }
      );
    }
    checkPermissions();
  }, []);

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        // await AsyncStorage.setItem('token', data.access); // Store the token
        await AsyncStorage.setItem('org_id',data.organization_id)
      
        await AsyncStorage.setItem('user_data', JSON.stringify(data)); 

        
        setTimeout(() => {
          alert('Login Successful');
          navigation.navigate('(tabs)'); 
        }, 2000);
       
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={AdminLogo} style={styles.logo} />
      <Text style={styles.title}>User Login</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>  
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text>If You are a admin login through web portal</Text>
        {/* <Link href='UserRegister'><Text>Not a User? Login</Text></Link> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(244, 247, 254)',
  },
  logo: {
    height: 100,
    width: 400,
    objectFit: 'contain',
    margin: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 30,
    fontWeight: '700',
    color: 'rgb(43, 54, 116)',
  },
  formGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    display: 'block',
    marginBottom: 5,
    fontSize: 18,
    color: 'rgb(82, 82, 82)',
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgb(201, 201, 201)',
    borderRadius: 5,
    boxSizing: 'border-box',
  },
  Button: {
    backgroundColor: 'rgb(62, 47, 192)',
    color: 'white',
    padding: 13,
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: '500',
    boxShadow: '0px 4px 24px 0px rgba(5, 90, 168, 0.3)',
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserLogin;