import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefiningTransportation,
  setLocationAtIndex,
  setLocationNameAtIndex,
  setPointList,
  treapSelector,
} from "../../store/treap";
import MapInputAutocomplete from "./MapInputAutocomplete";
import TransportSelectBtn from "./TransportSelectBtn";

const MapPanelInputList = ({ modalVisible, setModalVisible, onMoveTo }) => {
  const { pointList } = useSelector(treapSelector);
  const dispatch = useDispatch();
  function onPlaceSelected(details, index) {
    const position = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
    };
    onMoveTo(position);
    //TODO: Make this less dispatches
    dispatch(setDefiningTransportation(index));
    dispatch(setLocationAtIndex({ index, location: position }));
    dispatch(setLocationNameAtIndex({ index, locationName: details.name }));
  }
  function removeStop(index) {
    // Criar uma nova lista sem o ponto a ser removido
    if (pointList.length === 2) {
      return;
    }
    let newPointList = [
      ...pointList.slice(0, index),
      ...pointList.slice(index + 1),
    ];
    dispatch(setPointList(newPointList));
  }
  return (
    <>
      {pointList &&
        pointList.map((point, index) => {
          const key = `${index}-${point.latitude}-${point.longitude}`;
          const location = {
            latitude: point.latitude,
            longitude: point.longitude,
          };
          return index === 0 ? null : (
            <View key={key} style={styles.panelRow}>
              <MapInputAutocomplete
                placeholder={
                  index < pointList.length - 1 ? "Paragem" : "Destino"
                }
                onPlaceSelected={(details) => onPlaceSelected(details, index)}
                index={index}
              />

              {!modalVisible && (
                <>
                  <TouchableOpacity
                    style={{ padding: 5, marginRight: 10}}
                    onPress={() => {
                      removeStop(index);
                    }}
                  >
                    <FontAwesome6 name="xmark" size={20} color="#000000" />
                  </TouchableOpacity>

                  <TransportSelectBtn
                    index={index}
                    location={location}
                    setModalVisible={setModalVisible}
                  />
                </>
              )}
            </View>
          );
        })}
    </>
  );
};

export default MapPanelInputList;

const styles = StyleSheet.create({
  panelRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
