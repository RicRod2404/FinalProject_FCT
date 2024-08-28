import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { setDefiningTransportation, treapSelector } from "../../store/treap";
import { useDispatch, useSelector } from "react-redux";
import { locationIsValid } from "../../utils/mapFunctions";
import { convertToTransportString } from "../../utils/convertTransport";

const TransportSelectBtn = ({ index, location, setModalVisible }) => {
  const dispatch = useDispatch();
  const { pointList } = useSelector(treapSelector);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        if (locationIsValid(location)) {
          setModalVisible();
          // IIFE para capturar o valor correto de index
          ((index) => {
            dispatch(setDefiningTransportation(index));
          })(index);
        }
      }}
    >
      <Text style={styles.buttonText}>
        {!pointList.at(index - 1).transport
          ? "Deslocação"
          : convertToTransportString(pointList.at(index - 1).transport)}
      </Text>
    </TouchableOpacity>
  );
};

export default TransportSelectBtn;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8d4bf1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    borderRadius: 8,
    width: "30%",
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 10,
  },
});
