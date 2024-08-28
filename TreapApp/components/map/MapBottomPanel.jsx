import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTotalCarbonFootprint,
  selectTotalDistance,
  selectTotalDuration,
  selectTotalLeafPoints,
  setLocationAtIndex,
  setTreapActive,
  setUserLocation,
  treapSelector,
} from "../../store/treap";
import {
  formatarDistancia,
  formatarDuracao,
  formatarPegadadeCarbono,
  formatarPontos,
} from "../../utils/helperFunction";
import { followUser } from "../../utils/mapFunctions";

const MapBottomPanel = ({ mapRef }) => {
  //TODO: Nao utilizar selectors
  const distance = useSelector(selectTotalDistance);
  const duration = useSelector(selectTotalDuration);
  const leafPoints = useSelector(selectTotalLeafPoints);
  const carbonFootprint = useSelector(selectTotalCarbonFootprint);
  const router = useRouter();
  const { userLocation } = useSelector(treapSelector);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <View style={styles.gains}>
        <View style={styles.gainsRow}>
          <Text style={styles.gain}>Duração: {formatarDuracao(duration)}</Text>
          <Text style={styles.gain}>
            Distância: {formatarDistancia(distance)}
          </Text>
        </View>
        <View style={styles.gainsRow}>
          <Text style={styles.gain}>
            Co2e total: {formatarPegadadeCarbono(carbonFootprint)}
          </Text>
          <Text style={styles.gain}>
            LeafPoints:
            {formatarPontos(leafPoints)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (distance === 0) return;
          dispatch(setTreapActive(true));
          followUser(mapRef, userLocation);
        }}
      >
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.replace("/home");
        }}
      >
        <Text style={styles.link}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapBottomPanel;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#fffef6",
    gap: 15,
  },
  gains: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 20,
    paddingHorizontal: 20,
  },
  gainsRow: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  gain: {
    color: "#150f4c",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#8d4bf1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "50%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 20,
  },

  link: {
    color: "#150f4c",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
