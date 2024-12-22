import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Evaluate = () => {
  const [data, setData] = useState([
    { id: '1', answerSheetName: 'Answer Sheet 1', evaluationStatus: 'Pending' },
    { id: '2', answerSheetName: 'Answer Sheet 2', evaluationStatus: 'Pending' },
    { id: '3', answerSheetName: 'Answer Sheet 3', evaluationStatus: 'Success' },
    
    // Add more data as needed
  ]);

  const handleEvaluate = (id) => {
    Alert.alert('Evaluation', `Evaluating ${id}`);
    // Update the evaluation status
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, evaluationStatus: 'Evaluated' } : item
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.answerSheetName}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleEvaluate(item.id)}
      >
        <Text style={styles.buttonText}>{item.evaluationStatus}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Answer Sheet Name</Text>
        <Text style={styles.headerText}>Evaluation Status</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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