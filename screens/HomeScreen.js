import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Aqui está o import correto do AsyncStorage
import Parse from "parse/react-native";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "AcbCVd5qFReuAKPcvlyAWRxuRjZtupVTKPAuxPZb",
  "kLs7Du8zUmKAz1k3ORdxNVkYhJCXrIAvfqTjY5Hn"
); // Substitua com seu App ID e sua JavaScript Key
Parse.serverURL = "https://parseapi.back4app.com/";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    const watchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          if (isRecording) {
            setDistance((prevD) => prevD + 1);
            setPath((prevPath) => [
              ...prevPath,
              {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              },
            ]);
          }
        }
      );

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
    route.set("distancia", distance);
    route.set("date", new Date());
    route.set("path", path);
    await route.save();
    setName("");
    setPath([]);
  };

  return (
    <View style={styles.container}>
      {isRecording ? (
        <>
          <View style={styles.gifView}>
            <Image
              source={require("../assets/img/personagem_andando.gif")}
              style={styles.gifPA}
            />
          </View>
          <Text style={{ fontSize: 20, marginTop: 20 }}>
            Andando a{" "}
            {distance < 1000 ? distance + " metros" : distance / 1000 + " KM"}
          </Text>
        </>
      ) : (
        <View style={{ width: "80%" }}>
          <Text style={{ fontSize: 20 }}>Nome da rota:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
      )}
      <View style={styles.btnState}>
        <Button
          title={isRecording ? "Parar" : "Começar"}
          color={"#8a4af3"}
          onPress={isRecording ? stopRecording : startRecording}
        />
      </View>
      <View style={{ marginTop: 15, width: "80%" }}>
        <Button
          title={"No Mapa"}
          color={"#8a4af3"}
          onPress={() => {
            if (path) {
              navigation.navigate("Localização Atual", {
                pathA: path,
                m: "as",
              });
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnState: {
    width: "80%",
    marginTop: 50,
    borderRadius: 10,
  },

  gifPA: {
    width: "100%",
    height: "100%",
  },
  gifView: {
    width: "50%",
    height: "50%",
  },
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  navButtons: {
    marginTop: 20,
  },
});
