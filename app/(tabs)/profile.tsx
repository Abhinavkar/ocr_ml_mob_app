import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Remove the token
    navigation.navigate('UserLogin'); // Navigate back to login
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
        />
        <Text style={styles.name}>Abhinav Kar</Text>
        <Text style={styles.email}>abhinav.kar@vvdntech.in</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Role:</Text>
          <Text style={styles.info}>User</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Dummy:</Text>
          <Text style={styles.info}>Dummy</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Subject:</Text>
          <Text style={styles.info}>Mathematics</Text>
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