import { StyleSheet, View } from "react-native";

import MapView, { Marker } from "react-native-maps";
import MapViewCluster from "react-native-map-clustering";

const initialRegion = {
  latitude: 49.832910401276386,
  longitude: 24.017042091014602,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MapViewCluster
        style={styles.map}
        mapType="satellite"
        initialRegion={initialRegion}
        onLongPress={(e) => {
          console.log("Coordinates", e.nativeEvent.coordinate);
        }}
      >
        <Marker
          coordinate={{
            latitude: 49.82880427225914,
            longitude: 24.041275964021366,
          }}
          title="Наша точка"
          description="Ми тут"
        />
      </MapViewCluster>
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
});
