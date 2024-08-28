import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useUserLocationTrack = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const getPermissionAndStartTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      setSubscription(subscription);
    };

    getPermissionAndStartTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  return userLocation;
};
