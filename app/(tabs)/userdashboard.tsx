import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLogo from '../../assets/images/blacklogo.png';
import { Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDashboard = () => {
  const navigation = useNavigation<any>();
  const [rollNo, setRollNo] = useState('');
  const [examId, setExamId] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [pdf, setPdf] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examIds, setExamIds] = useState([]);
  const [classSelected, setClassSelected] = useState('');
  const [sectionSelected, setSectionSelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [organizationSelected, setOrganizationSelected] = useState('');
  const [userOrgId, setUserOrgId] = useState('');

  useEffect(() => {
    const fetchUserOrgId = async () => {
      const orgId = await AsyncStorage.getItem('org_id');
      setUserOrgId(orgId);
      console.log("UserOrgId", orgId);
    };
    fetchUserOrgId();
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/services/get/organization/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setOrganizations(data);
        console.log("organizations", data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        Alert.alert('Error', 'An error occurred while fetching organizations.');
      }
    };
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (organizationSelected) {
      fetchClasses(organizationSelected);
    } else {
      setClasses([]);
      setClassSelected('');
      setSections([]);
      setSectionSelected('');
      setSubjects([]);
      setSubjectSelected('');
    }
  }, [organizationSelected]);

  useEffect(() => {
    if (classSelected) {
      fetchSections(classSelected);
      setSectionSelected(''); // Reset section selection when class changes
    } else {
      setSections([]); // Clear sections when no class is selected
      setSectionSelected('');
      setSubjects([]);
      setSubjectSelected('');
    }
  }, [classSelected]);

  useEffect(() => {
    if (sectionSelected) {
      fetchSubjects(sectionSelected);
      setSubjectSelected(''); // Reset subject selection when section changes
    } else {
      setSubjects([]); // Clear subjects when no section is selected
      setSubjectSelected('');
    }
  }, [sectionSelected]);

  useEffect(() => {
    if (classSelected && sectionSelected && subjectSelected) {
      fetchExamId(classSelected, sectionSelected, subjectSelected);
    } else {
      setExamIds([]);
      setExamId('');
    }
  }, [classSelected, sectionSelected, subjectSelected]);

  const fetchClasses = async (organization_id) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/services/classes/${organization_id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data || []);
      } else {
        Alert.alert('Error', 'Failed to fetch classes.');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      Alert.alert('Error', 'An error occurred while fetching classes.');
    }
  };

  const fetchSections = async (classId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/services/sections/${classId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setSections(data || []);
      } else {
        Alert.alert('Error', 'Failed to fetch sections.');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      Alert.alert('Error', 'An error occurred while fetching sections.');
    }
  };

  const fetchSubjects = async (sectionId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/services/subjects/${sectionId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data || []);
      } else {
        Alert.alert('Error', 'Failed to fetch subjects.');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      Alert.alert('Error', 'An error occurred while fetching subjects.');
    }
  };

  const fetchExamId = async (classId,sectionId,subjectId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/services/get/exam-id/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'classId': classId,
          'sectionId': sectionId,
          'subjectId': subjectId,

        
          'organizationId': userOrgId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExamIds(data.exam_ids);
        print(data.exam_ids);
      } else {
        console.error('Failed to fetch exam ID');
      }
    } catch (error) {
      console.error('Error fetching exam ID:', error);
    }
  };

  const handleOpenCamera = () => {
    if (!rollNo || !examId || !classSelected || !sectionSelected || !subjectSelected) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    // Navigate to CameraScreen with the input data
    navigation.navigate('CameraScreen', {
      params: {
        rollNo: rollNo,
        examId: examId,
        className: classSelected,
        section: sectionSelected,
        subject: subjectSelected,
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
    formData.append('classId', classSelected); // Include classId in the form data
    formData.append('sectionId', sectionSelected); // Include sectionId in the form data
    formData.append('subjectId', subjectSelected);
    formData.append('organizationId', userOrgId);
    formData.append('answer_pdf', {
      uri: pdf,
      name: 'answer.pdf',
      type: 'application/pdf',
    });

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/qa/upload/answers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Answer uploaded successfully.');
        // Reset form data
        setRollNo('');
        setExamId('');
        setClassSelected('');
        setSectionSelected('');
        setSubjectSelected('');
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
      console.log("PDF URI:", result.assets[0].uri);
      Alert.alert('PDF Selected', 'PDF has been selected successfully.');
    } else {
      Alert.alert('Error', 'No PDF selected.');
    }
  };
  // const { itemId, otherParam } = route.params;
  // console.log(itemId)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={AdminLogo} style={styles.logo} />

        <Text style={styles.title}>Welcome To Q&A Analyzer</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Organization</Text>
          <Picker
            selectedValue={organizationSelected}
            style={styles.input}
            onValueChange={(itemValue) => setOrganizationSelected(itemValue)}
          >
            <Picker.Item label="Select Organization" value="" />
            {organizations.map((organization) => (
              <Picker.Item key={organization._id} label={organization.organization_name} value={organization._id} />
            ))}
          </Picker>
        </View>

       
        <View style={styles.formGroup}>
          <Text style={styles.label}>Class</Text>
          <Picker
            selectedValue={classSelected}
            style={styles.input}
            onValueChange={(itemValue) => setClassSelected(itemValue)}
          >
            <Picker.Item label="Select Class" value="" />
            {classes.map((classItem) => (
              <Picker.Item key={classItem._id} label={classItem.name} value={classItem._id} />
            ))}
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Section</Text>
          <Picker
            selectedValue={sectionSelected}
            style={styles.input}
            onValueChange={(itemValue) => setSectionSelected(itemValue)}
          >
            <Picker.Item label="Select Section" value="" />
            {sections.map((sectionItem) => (
              <Picker.Item key={sectionItem._id} label={sectionItem.name} value={sectionItem._id} />
            ))}
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject</Text>
          <Picker
            selectedValue={subjectSelected}
            style={styles.input}
            onValueChange={(itemValue) => setSubjectSelected(itemValue)}
          >
            <Picker.Item label="Select Subject" value="" />
            {subjects.map((subjectItem) => (
              <Picker.Item key={subjectItem._id} label={subjectItem.name} value={subjectItem._id} />
            ))}
          </Picker>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Exam ID</Text>
          <Picker
            selectedValue={examId}
            style={styles.input}
            onValueChange={(itemValue) => setExamId(itemValue)}
          >
            <Picker.Item label="Select Exam ID" value="" />
            {examIds.map((examItem, index) => (
              <Picker.Item key={index} label={examItem} value={examItem} />
            ))}
          </Picker>
        </View>
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
    </ScrollView>
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