import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Aqui está o import correto do AsyncStorage
import Parse from 'parse/react-native';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("AcbCVd5qFReuAKPcvlyAWRxuRjZtupVTKPAuxPZb", "kLs7Du8zUmKAz1k3ORdxNVkYhJCXrIAvfqTjY5Hn"); // Substitua com seu App ID e sua JavaScript Key
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [path, setPath] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const watchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission to access location was denied");
        return;
      }

      const subscription = Location.watchPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      }, (loc) => {
        if (isRecording) {
          setPath((prevPath) => [...prevPath, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }]);
        }
      });

      return () => subscription.remove();
    };
    
    watchPosition();
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const Route = Parse.Object.extend("Route");
    const route = new Route();
    route.set("name", name);
    route.set("date", new Date());
    route.set("path", path);
    await route.save();
    setName('');
    setPath([]);
  };

  return (
    <View style={styles.container}>
      <Text>Route Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Button title={isRecording ? "Stop" : "Start"} onPress={isRecording ? stopRecording : startRecording} />
      <View style={styles.navButtons}>
        <Button title="List Routes" onPress={() => navigation.navigate('ListRoutes')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  navButtons: {
    marginTop: 20,
  }
});