import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Evaluate = () => {
  const [data, setData] = useState([]);
  const [rollNo, setRollNo] = useState('');
  const [examId, setExamId] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSelected, setClassSelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classSelected) {
      fetchSubjects(classSelected);
      setSubjectSelected(''); // Reset subject selection when class changes
    } else {
      setSubjects([]); // Clear subjects when no class is selected
      setSubjectSelected('');
    }
  }, [classSelected]);

  const fetchClasses = async () => {
    try {
    

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/qa/classes/`, {
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

  const fetchSubjects = async (classId) => {
    try {
    
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/qa/subjects/${classId}/`, {
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

  const handleEvaluate = async () => {
    if (!rollNo || !examId || !classSelected || !subjectSelected) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/qa/evaluate/`, {
        method: 'POST',
        headers: {
       
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNo,
          examId,
          classId: classSelected,
          subjectId: subjectSelected,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setData(data || []);
      } else {
        Alert.alert('Error', 'Failed to fetch evaluation data.');
      }
    } catch (error) {
      console.error('Error fetching evaluation data:', error);
      Alert.alert('Error', 'An error occurred while fetching evaluation data.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.answerSheetName}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Evaluation', `Evaluating ${item.id}`)}
      >
        <Text style={styles.buttonText}>{item.evaluationStatus}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <TouchableOpacity style={styles.evaluateButton} onPress={handleEvaluate}>
        <Text style={styles.buttonText}>Get Result</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerText}>Answer Sheet Id</Text>
        <Text style={styles.headerText}>Evaluation Status</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>2420823234234</Text>
        <Text style={styles.headerText}>43.97%</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  evaluateButton: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Evaluate;