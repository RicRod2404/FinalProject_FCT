import MapViewDirections from "react-native-maps-directions";
import { API_MAPS_KEY2 } from "@env";
import Constants from "expo-constants";
export const CustomMapViewDirections = ({
  origin,
  destination,
  transport,
  onReady,
}) => {
  const apiKey =
    API_MAPS_KEY2 ||
    process.env.API_MAPS_KEY2 ||
    Constants?.manifest2?.extra?.API_MAPS_KEY2;

  return (
    <>
      {apiKey && (
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={apiKey}
          strokeColor="#8d4bf1"
          strokeWidth={4}
          mode={transport}
          onReady={onReady}
        />
      )}
    </>
  );
};
