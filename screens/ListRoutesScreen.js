import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import Parse from 'parse/react-native';

export default function ListRoutesScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const Route = Parse.Object.extend('Route');
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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.routeItem}>
            <Text>{item.get('name')}</Text>
            <Button title="View" onPress={() => navigation.navigate('RouteDetail', { route: item })} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});