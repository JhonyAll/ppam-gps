import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

export default function RouteDetailScreen({ route }) {
  const { name, path } = route.params.route.get();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <MapView style={styles.map}>
        <Polyline coordinates={path} strokeWidth={4} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  map: {
    flex: 1,
  }
});