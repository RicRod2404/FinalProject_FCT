import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { resetTreap, treapSelector } from "../../store/treap";
import {
  findFurthestPoint,
  handleTraceRoute,
  isCameraCenteredAtPosition,
  moveTo,
} from "../../utils/mapFunctions";
import Panels from "../../components/map/Panels";
import { UserMarker } from "../../components/map/UserMarker";
import { useUserLocation } from "../../hooks/useUserLocation";
import MapContent from "../../components/map/MapContent";
import CenterPositionBtn from "../../components/map/CenterPositionBtn";
import LoadingSpinner from "../../components/LoadingSpinner";
export default function NovaTreap() {
  //Hooks
  const [isMapReady, setIsMapReady] = useState(false);
  const [isCameraCentered, setIsCameraCentered] = useState(false);
  const mapRef = useRef();
  const dispatch = useDispatch();
  const userLocation = useUserLocation();
  const { pointList, treapActive } = useSelector(treapSelector);
  //Constants

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const origin = {
    latitude: pointList[0].latitude,
    longitude: pointList[0].longitude,
  };
  //Functions
  function onMapReady() {
    setIsMapReady(true);
  }
  function onMoveTo(location) {
    moveTo(mapRef, location, isMapReady);
    setIsCameraCentered(true);
  }
  //Effects
  useEffect(() => {
    dispatch(resetTreap());
  }, []);
  useEffect(() => {
    if (mapRef && mapRef?.current && isMapReady && userLocation) {
      isCameraCenteredAtPosition(mapRef, userLocation)
        .then((isCentered) => {
          setIsCameraCentered(isCentered);
        })
        .catch((error) => {
          console.error("Erro ao verificar se a câmera está centrada:", error);
        });
    }
  }, [isMapReady, userLocation, mapRef]);
  return (
    <SafeAreaView style={styles.container}>
      {userLocation ? (
        <>
          <MapView
            onPanDrag={() => setIsCameraCentered(false)}
            loadingEnabled={true}
            ref={mapRef}
            onMapReady={onMapReady}
            style={[
              styles.map,
              {
                opacity: 1,
              },
            ]}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 40.75559,
              longitude: -2.2678049,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            {isMapReady && (
              <UserMarker
                startLocation={userLocation}
                onMoveTo={onMoveTo}
                mapRef={mapRef}
                isCameraCentered={isCameraCentered}
                setIsCameraCentered={setIsCameraCentered}
              />
            )}
            {/* {pointList && <MapContent />} */}
            {pointList && <MapContent />}
          </MapView>
          {isMapReady && !isCameraCentered && (
            <CenterPositionBtn mapRef={mapRef} onMoveTo={onMoveTo} />
          )}
        </>
      ) : (
        <LoadingSpinner
          fullPage={true}
          size="large"
          message="A Carregar o Mapa"
        />
      )}
      {isMapReady && <Panels onMoveTo={onMoveTo} mapRef={mapRef} />}
      {!treapActive &&
        isMapReady &&
        isCameraCentered &&
        handleTraceRoute(mapRef, origin, findFurthestPoint(pointList))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
