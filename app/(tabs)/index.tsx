import { StyleSheet, View } from "react-native";

import MapView, { Marker, UrlTile } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

const initialRegion = {
  latitude: 49.832910401276386,
  longitude: 24.017042091014602,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 49.82880427225914,
    longitude: 24.041275964021366,
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");

        return;
      }

      subscription = await Location.watchPositionAsync(
        { distanceInterval: 50, accuracy: Location.Accuracy.High },
        (location) => {
          console.log("Location: ", location);

          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    };

    requestLocationPermission();

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="standard"
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={userLocation}
          title="Наша точка"
          description="Ми тут"
        >
          <View style={styles.currentPosition} />
        </Marker>

        {selectedLocation !== null && (
          <Marker
            coordinate={selectedLocation}
            title="Вибрана точка"
            description="Ви вибрали це місце"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  currentPosition: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "#19F",
    borderColor: "#fff",
    borderWidth: 2,
  },
});
