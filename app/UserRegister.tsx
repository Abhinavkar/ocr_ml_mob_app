import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLogo from '../assets/images/blacklogo.png';
import { Image } from 'react-native';

const UserRegister = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Registration successful.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Failed to register.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while registering.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={AdminLogo} style={styles.logo} />

      <Text style={styles.title}>Register</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter Username"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          secureTextEntry
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
      </View>

      <Pressable style={styles.registerButton} onPress={handleRegister} disabled={isRegistering}>
        <Text style={styles.buttonText}>{isRegistering ? 'Registering...' : 'Register'}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(244, 247, 254)',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: 'rgb(43, 54, 116)',
    marginBottom: 20,
  },
  formGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: 'rgb(82, 82, 82)',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgb(201, 201, 201)',
    borderRadius: 5,
    boxSizing: 'border-box',
  },
  logo: {
    height: 100,
    width: 400,
    objectFit: 'contain',
    margin: 10,
  },
  registerButton: {
    backgroundColor: 'rgb(62, 47, 192)',
    padding: 13,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    color: 'rgb(62, 47, 192)',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
  },
});

export default UserRegister;