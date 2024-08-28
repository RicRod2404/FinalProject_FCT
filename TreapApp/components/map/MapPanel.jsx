import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPointList, treapSelector } from "../../store/treap";
import Constants from "expo-constants";
import MapPanelInputList from "./MapPanelInputList";
export default MapPanel = React.memo(
  ({ modalVisible, setModalVisible, onMoveTo }) => {
    const { pointList } = useSelector(treapSelector);
    const dispatch = useDispatch();
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    function handlePress() {
      setIsOptionsVisible(!isOptionsVisible);
    }
    function addStop() {
      if (pointList.length >= 5) return; // Limitar a 10 pontos
      let newPoint = {
        latitude: -1,
        longitude: -1,
        transport: "DRIVING",
        duration: 0,
        distance: 0,
        leafPoints: 0,
        carbonFootprint: 170,
        passed: false,
      };
      // Criar uma nova lista com o novo ponto inserido antes do último elemento
      let newPointList = [
        ...pointList.slice(0, 1),
        newPoint,
        ...pointList.slice(1),
      ];
      dispatch(setPointList(newPointList));
      setIsOptionsVisible(false);
    }
    return (
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.optionsBtn}>
          <View style={{ marginRight: 10 }}>
            <FontAwesome6 name={"ellipsis"} size={20} color="#3f3f3f" />
          </View>
        </TouchableOpacity>
        {isOptionsVisible && (
          <View style={styles.options}>
            <TouchableOpacity onPress={addStop} style={styles.optionsBtn}>
              <Text style={{ fontSize: 15 }}>Adicionar Paragem</Text>
            </TouchableOpacity>
          </View>
        )}
        <MapPanelInputList
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onMoveTo={onMoveTo}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  optionsBtn: {
    alignSelf: "flex-end",
  },
  options: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 14,
    zIndex: 1,
    position: "absolute",
    padding: 10,
    backgroundColor: "#fff",
    height: "auto",
    alignSelf: "flex-end",
    right: 15,
    top: 20,
    borderColor: "#a0a0a0",
    borderWidth: 1,
    borderRadius: 8,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    alignSelf: "center",
    top: Constants.statusBarHeight + 15,
  },
});
