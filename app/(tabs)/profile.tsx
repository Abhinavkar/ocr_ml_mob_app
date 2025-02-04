import React , {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null); 
  const handleLogout = async () => {
    navigation.navigate('UserLogin');
  };
  // get user_data from async storage userData {"_h": 0, "_i": 0, "_j": null, "_k": null}

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('user_data');
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, []);
  console.log('userData', userData);  


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
        />
        <Text style={styles.name}>{userData?.first_name} {userData?.last_name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Role:</Text>
          <Text style={styles.info}>{userData?.is_admin  ? 'Admin' : 'User'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Department:</Text>
          <Text style={styles.info}>{userData?.department}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Organization:</Text>
          <Text style={styles.info}>{userData?.organization}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Section Assigned:</Text>
          <Text style={styles.info}>{userData?.section_assigned}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  body: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
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