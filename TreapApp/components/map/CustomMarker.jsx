import { Marker } from "react-native-maps";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { Image } from "react-native";

export const CustomMarker = ({ point, type }) => {
  const { profilePic } = useSelector(sessionSelector);
  return (
    <Marker
      coordinate={{
        latitude: point.latitude,
        longitude: point.longitude,
      }}
    >
      {type === "destination" && (
        <FontAwesome6 name="flag-checkered" size={30} color="black" />
      )}
      {type === "user" && (
        <Image
          source={{ uri: profilePic }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      )}
      {type === "checkpoint" && (
        <FontAwesome6 name="map-pin" size={30} color="#150f4c" />
      )}
    </Marker>
  );
};
