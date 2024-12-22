import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Platform } from 'react-native';
import { CameraView ,Camera} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import jsPDF from "jspdf";

const CameraScreen = ({route}) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  // const { rollNo, examId, className, subject } = route.params;
  // console.log(rollNo,examId,className,subject)
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync({
        base64: true,
        skipProcessing: false,
      });
      setPhotos([...photos, photoData]);
    }
  };

  const handleGeneratePDF = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please capture some photos first.');
      return;
    }

    try {
      const pdf = new jsPDF();
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (i > 0) {
          pdf.addPage();
        }
        try {
          const base64Image = `data:image/jpeg;base64,${photo.base64}`;
          pdf.addImage(
            base64Image, 
            'JPEG', 
            10,   // x position
            10,   // y position
            190,  // width
            250   // height
          );
        } catch (imageError) {
          console.error('Error adding image to PDF:', imageError);
          try {
            const base64 = await FileSystem.readAsStringAsync(photo.uri, {
              encoding: FileSystem.EncodingType.Base64
            });
            const base64Image = `data:image/jpeg;base64,${base64}`;
            
            pdf.addImage(
              base64Image, 
              'JPEG', 
              10, 
              10, 
              190, 
              250
            );
          } catch (readError) {
            console.error('Error reading file:', readError);
            Alert.alert('Error', 'Could not read image file');
            return;
          }
        }
      }
      const pdfData = pdf.output('datauristring').split(',')[1];
      const fileName = `captured_photos_${Date.now()}.pdf`;
      if(Platform.OS=='android'){
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (!permissions.granted) {
        Alert.alert('Permission Denied', 'Storage access permission is required to save the PDF.');
        return;
      }
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri, 
        fileName, 
        'application/pdf'
      );
      await FileSystem.writeAsStringAsync(fileUri, pdfData, { 
        encoding: FileSystem.EncodingType.Base64 
      });

      Alert.alert('Success', 'PDF has been saved successfully!');



      setPhotos([]);
      
      
      }
      else if (Platform.OS == 'ios') {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, pdfData, { 
          encoding: FileSystem.EncodingType.Base64 
        });
      
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save PDF File',
          });
          Alert.alert('Success', 'PDF has been saved or shared successfully!');
        } else {
          Alert.alert(
            'Sharing Not Available',
            'Unable to share the file. Please check your device settings.'
          );
        }
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert('Error', 'Failed to generate or save PDF.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera} 
        ref={cameraRef} 
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          
          {photos.length > 0 && (
            <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
              <Text style={styles.text}>Generate PDF</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>

      <View style={styles.photoContainer}>
        {photos.map((photo, index) => (
          <Image 
            key={index} 
            source={{ uri: photo.uri }} 
            style={styles.photoPreview} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end' },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    paddingVertical: 20 
  },
  button: { 
    alignItems: 'center', 
    padding: 10, 
    margin: 10, 
    backgroundColor: 'white', 
    borderRadius: 5 
  },
  text: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  photoContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
    padding: 10 
  },
  photoPreview: { 
    width: 100, 
    height: 100, 
    margin: 5 
  }
});

export default CameraScreen;