import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { treapSelector } from "../../store/treap";

const CenterPositionBtn = ({ mapRef, onMoveTo }) => {
  const { userLocation } = useSelector(treapSelector);
  function recenterMap() {
    if (mapRef.current) {
      onMoveTo(userLocation); // Assumindo que onMoveTo cuida de mover a câmera para a posição desejada
    }
  }
  return (
    <TouchableOpacity style={styles.recenterBtn} onPress={recenterMap}>
      <FontAwesome6 name="arrows-to-dot" size={20} color={"#150f4c"} />
    </TouchableOpacity>
  );
};

export default CenterPositionBtn;

const styles = StyleSheet.create({
  recenterBtn: {
    position: "absolute",
    bottom: 200,
    right: 30,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#35a076",
    height: 50,
  },
});
