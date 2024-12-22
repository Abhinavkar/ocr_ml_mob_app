import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLogo from '../../assets/images/blacklogo.png';
import { Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const UserDashboard = () => {
  const navigation = useNavigation<any>();
  const [rollNo, setRollNo] = useState('');
  const [examId, setExamId] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [pdf, setPdf] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenCamera = () => {
    if (!rollNo || !examId || !className || !subject) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    // Navigate to CameraScreen with the input data
    navigation.navigate('CameraScreen', {
      params: {
        rollNo: rollNo,
        examId: examId,
        className: className,
        subject: subject,
      },
    });
  };

  const uploadAnswer = async () => {
    if (!pdf) {
      Alert.alert('Validation Error', 'Please select a PDF to upload.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('rollNo', rollNo);
    formData.append('examId', examId);
    formData.append('classId', className);
    formData.append('subject', subject);
    formData.append('pdf', {
      uri: pdf,
      name: 'answer.pdf',
      type: 'application/pdf',
    });

    try {
      const response = await fetch('http://192.168.21.56:8000/api/qa/user/upload/answer/pdf/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Answer uploaded successfully.');
        //reset form   setRollNo('');
      setExamId('');
      setClassName('');
      setSubject('');
      setPdf(null);
        
      } else {
        Alert.alert('Error', 'Failed to upload answer.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while uploading the answer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePickPdf = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    console.log(result);
    if (result.assets) {
      setPdf(result.assets[0].uri);
      console.log("PDF URI:", pdf);
      Alert.alert('PDF Selected', 'PDF has been selected successfully.');
    } else {
      Alert.alert('Error', 'No PDF selected.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={AdminLogo} style={styles.logo} />

      <Text style={styles.title}>Welcome To Q&A Analyzer</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Roll No</Text>
        <TextInput
          style={styles.input}
          value={rollNo}
          onChangeText={setRollNo}
          placeholder="Enter Roll No"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Exam ID</Text>
        <TextInput
          style={styles.input}
          value={examId}
          onChangeText={setExamId}
          placeholder="Enter Exam ID"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Class</Text>
        <TextInput
          style={styles.input}
          value={className}
          onChangeText={setClassName}
          placeholder="Enter Class"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter Subject"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Upload PDF</Text>
        <Pressable style={styles.uploadButton} onPress={handlePickPdf}>
          <Text style={styles.uploadButtonText}>Select PDF</Text>
        </Pressable>
        {pdf && (
          <Text style={styles.pdfName}>{pdf.split('/').pop()}</Text>
        )}
      </View>

      <Pressable style={styles.loginButton} onPress={uploadAnswer} disabled={isUploading}>
        {isUploading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Submit Answer</Text>
        )}
      </Pressable>
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
  loginButton: {
    backgroundColor: 'rgb(62, 47, 192)',
    padding: 13,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: 'rgb(62, 47, 192)',
    padding: 13,
    borderRadius: 12,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  pdfName: {
    fontSize: 14,
    color: 'rgb(82, 82, 82)',
    marginTop: 5,
  },
});

export default UserDashboard;
