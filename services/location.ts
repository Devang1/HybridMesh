import * as Location from "expo-location";

export async function getEmergencyLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return undefined;

  const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return {
    latitude: current.coords.latitude,
    longitude: current.coords.longitude,
    accuracy: current.coords.accuracy
  };
}
