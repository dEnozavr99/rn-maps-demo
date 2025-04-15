import { StyleSheet, View } from "react-native";

import MapView, { MapPressEvent, Marker, UrlTile } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native-safe-area-context";
import MapViewDirections from "react-native-maps-directions";

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
    name?: string;
    address?: string;
  } | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("Permission to access location was denied");

        return;
      }

      subscription = await Location.watchPositionAsync(
        { distanceInterval: 50, accuracy: Location.Accuracy.High },
        (location) => {
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

  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setSelectedLocation({ latitude, longitude });

    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response.length < 0) {
        console.warn("Response is empty");

        setSelectedLocation((prev) => ({
          ...(prev || { latitude, longitude }),
          name: "Вибрана точка",
          address: "Ви вибрали це місце",
        }));

        return;
      }

      const { name, street, streetNumber } = response[0];

      setSelectedLocation((prev) => ({
        ...(prev ?? { latitude, longitude }),
        name: name ?? "",
        address: [street, streetNumber].filter(Boolean).join(" "),
      }));
    } catch (error) {
      console.error("Error fetching address: ", error);
    }
  };

  const handleLocationSelect = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    if (details === null) {
      console.warn("Details are null");

      return;
    }

    const { lat, lng } = details.geometry.location;

    setSelectedLocation({
      latitude: lat,
      longitude: lng,
      name: details.name,
      address: details.formatted_address,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Почніть вводити локацію"
          fetchDetails={true}
          onPress={handleLocationSelect}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
            language: "uk",
            components: "country:ua",
          }}
          styles={{
            container: styles.googleAutocompleteContainer,
            textInput: styles.googleAutocompleteInput,
          }}
        />

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
              title={selectedLocation.name}
              description={selectedLocation.address}
            />
          )}

          {selectedLocation !== null && (
            <MapViewDirections
              origin={userLocation}
              destination={selectedLocation}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
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
  googleAutocompleteContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    padding: 32,
  },
  googleAutocompleteInput: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
