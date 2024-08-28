import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";
import { CustomMarker } from "./map/CustomMarker";
import { CustomMapViewDirections } from "./map/CustomMapViewDirections";
import {
  canTraceDirections,
  findFurthestPoint,
  handleTraceRoute,
  locationIsValid,
  traceRoute,
} from "../utils/mapFunctions";
import {
  convertToTransportString,
  transportUsed,
} from "../utils/convertTransport";
import {
  formatarDataHora,
  formatarDistancia,
  formatarDuracao,
} from "../utils/helperFunction";
import { Facebook } from "react-content-loader/native";
const UserPost = ({ treap }) => {
  const {
    nickname,
    profilePic,
    carbonFootprint,
    distance,
    duration,
    lastModifiedDate: date,
    leafPoints,
    pointList,
  } = treap;
  const mapRef = useRef();
  const [isMapReady, setIsMapReady] = useState(false);
  const logo = "https://i.pravatar.cc/150?img=3"; //TODO: Change to user's logo
  const origin = {
    latitude: pointList[0].latitude,
    longitude: pointList[0].longitude,
  };
  const transportationUsed = transportUsed(pointList);

  function getLastPointCoordinates() {
    const lastIndex = pointList.length - 1;
    const last = pointList[lastIndex];
    return { latitude: last.latitude, longitude: last.longitude };
  }
  function onMapReady() {
    setIsMapReady(true);
  }
  return (
    <View style={styles.container}>
      {!treap ? (
        <Facebook />
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.userDetails}>
              <Image
                source={{ uri: profilePic || logo }}
                style={styles.userImage}
              />
              <View>
                <Text style={styles.userName}>@{nickname}</Text>
                <Text style={styles.dateAndLocation}>
                  {formatarDataHora(date)}
                </Text>
              </View>
            </View>
            <Text style={styles.transportationUsed}>{transportationUsed}</Text>
          </View>
          <View style={styles.distAndFootprint}>
            <View style={styles.distAndFootprintItem}>
              <Text style={styles.distAndFootprintHeader}>Distância</Text>
              <Text style={styles.distAndFootprintValue}>
                {formatarDistancia(distance)}
              </Text>
            </View>
            <View style={styles.distAndFootprintItem}>
              <Text style={styles.distAndFootprintHeader}>CO2e/Km</Text>
              <Text style={styles.distAndFootprintValue}>
                {Math.ceil(carbonFootprint)}
              </Text>
            </View>
            <View style={styles.distAndFootprintItem}>
              <Text style={styles.distAndFootprintHeader}>Duração</Text>
              <Text style={styles.distAndFootprintValue}>
                {formatarDuracao(duration)}
              </Text>
            </View>
            <View style={styles.distAndFootprintItem}>
              <Text style={styles.distAndFootprintHeader}>LeafPoints</Text>
              <Text style={styles.distAndFootprintValue}>{leafPoints}</Text>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView ref={mapRef} style={styles.map} onMapReady={onMapReady}>
              {pointList &&
                locationIsValid(getLastPointCoordinates()) &&
                pointList.map((point, index) => (
                  <React.Fragment key={index}>
                    {index === pointList.length - 1 &&
                    locationIsValid(point) ? (
                      <CustomMarker point={point} type="destination" />
                    ) : (
                      locationIsValid(point) &&
                      index !== 0 && (
                        <CustomMarker point={point} type="checkpoint" />
                      )
                    )}
                    {canTraceDirections(pointList, point, index) && (
                      <CustomMapViewDirections
                        origin={pointList[index]}
                        destination={pointList[index + 1]}
                        transport={point.transport}
                      />
                    )}
                  </React.Fragment>
                ))}
            </MapView>
            {isMapReady &&
              handleTraceRoute(mapRef, origin, findFurthestPoint(pointList))}
          </View>
        </>
      )}
    </View>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 2,
    height: 450,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 30,
  },
  userDetails: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  dateAndLocation: {
    fontSize: 12,
    paddingLeft: 5,
    paddingTop: 3,
  },
  transportationUsed: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#150f4c",
  },
  distAndFootprint: {
    display: "flex",
    flexDirection: "row",
  },
  distAndFootprintItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 30,
    paddingVertical: 10,
  },
  distAndFootprintHeader: {
    fontSize: 10,
    color: "#3f3f3f",
  },
  distAndFootprintValue: {
    color: "#8d4bf1",
    fontSize: 15,
    fontWeight: "bold",
  },
  mapContainer: {
    paddingVertical: 10,
    height: "70%",
    width: "100%",
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
