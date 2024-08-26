import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Parse from "parse/react-native";

export default function ListRoutesScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const Route = Parse.Object.extend("Route");
      const query = new Parse.Query(Route);
      const results = await query.find();
      setRoutes(results);
    };
    fetchRoutes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.get("name")}</Text>
              <Text style={styles.date}>
                {item.get("date").toLocaleDateString()}
              </Text>
              <Text style={styles.distance}>
                Distância percorrida: {item.get("distancia")} km
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Rota", { route: item })}
              >
                <Text style={styles.buttonText}>Ver Rota</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  distance: {
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#8a4af3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  routeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
