import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCarbonFootPrintAtIndex,
  setTransportAtIndex,
  treapSelector,
} from "../../store/treap";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { convertToTransportMode } from "../../utils/convertTransport";
const TransportButton = ({ text, icon, carbonFootprint, setModalVisible }) => {
  const dispatch = useDispatch();
  const { transportationIdx: stopIdx } = useSelector(treapSelector);
  function onTransportSelected() {
    dispatch(
      setTransportAtIndex({
        index: stopIdx - 1,
        transport: convertToTransportMode(text),
      })
    );
    dispatch(
      setCarbonFootPrintAtIndex({ index: stopIdx - 1, carbonFootprint })
    );
    setModalVisible();
  }

  return (
    <TouchableOpacity style={styles.button} onPress={onTransportSelected}>
      <View style={styles.textContainer}>
        <Text style={styles.transportType}>{text}</Text>
        <Text style={styles.carbonFootprint}>{carbonFootprint}gCO2/km</Text>
      </View>
      <FontAwesome6 name={icon} size={40} color={"#fffef6"} />
    </TouchableOpacity>
  );
};

export default TransportButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#150f4c",
    paddingVertical: 10,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 10,
    height: "auto",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  icon: {
    color: "#fff",
  },
  transportType: {
    color: "#fff",
    fontSize: 20,
  },
  carbonFootprint: {
    color: "#35a076",
    fontSize: 15,
  },
});
