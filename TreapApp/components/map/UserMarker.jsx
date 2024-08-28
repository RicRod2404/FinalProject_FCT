import { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { Image } from "react-native";
import {
  setCarbonFootPrintAtIndex,
  setLocationAtIndex,
  setPassedAtIndex,
  setTransportAtIndex,
  setUserLocation,
  treapSelector,
} from "../../store/treap";
import { useEffect, useState } from "react";
import { useUserLocationTrack } from "../../hooks/useUserLocationTrack";
import {
  calculateDistance,
  followUser,
  locationIsValid,
} from "../../utils/mapFunctions";
export const UserMarker = ({
  startLocation,
  onMoveTo,
  mapRef,
  isCameraCentered,
  setIsCameraCentered,
}) => {
  const { profilePic } = useSelector(sessionSelector);
  const { treapActive, pointList } = useSelector(treapSelector);
  const dispatch = useDispatch();
  const userLocation = useUserLocationTrack();
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (startLocation && !moved) {
      dispatch(setUserLocation(startLocation));
      dispatch(setLocationAtIndex({ index: 0, location: startLocation }));
      dispatch(
        setTransportAtIndex({
          index: 0,
          transport: "DRIVING",
        })
      );
      dispatch(setCarbonFootPrintAtIndex({ index: 0, carbonFootprint: 170 }));
      onMoveTo(startLocation);
      setIsCameraCentered(true);
      setMoved(true);
    }
  }, [startLocation]);
  useEffect(() => {
    if (userLocation && locationIsValid(userLocation)) {
      dispatch(setUserLocation(userLocation));
      if (treapActive && isCameraCentered) {
        followUser(mapRef, userLocation);
      }

      //Iterate over the pointList and get the first point that is not passed and check if the user is near it (100m), if so, mark it as passed
      for (let i = 0; i < pointList.length; i++) {
        if (!pointList[i].passed) {
          let distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pointList[i].latitude,
            pointList[i].longitude
          );
          if (distance < 100) {
            dispatch(setPassedAtIndex({ index: i, passed: true }));
            break;
          }
        }
      }
    }
  }, [userLocation]);
  return (
    <>
      <Marker coordinate={userLocation || startLocation}>
        <Image
          source={{
            uri:
              profilePic ||
              "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
          }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </Marker>
    </>
  );
};
