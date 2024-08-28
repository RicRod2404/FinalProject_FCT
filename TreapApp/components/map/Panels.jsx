import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapPanel from "./MapPanel";
import TransportSelectModal from "./TransportSelectModal";
import MapBottomPanel from "./MapBottomPanel";
import { treapSelector } from "../../store/treap";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import {
  completedTreap,
  hasNotReachedAnyCheckpointOrDestination,
  hasReachedSomeCheckpoint,
  wentStraightToDestination,
} from "../../utils/mapFunctions";

const Panels = React.memo(({ onMoveTo, mapRef }) => {
  const { treapActive, pointList } = useSelector(treapSelector);
  const [isTransportModalVisible, setIsTransportModalVisible] = useState(false);
  function onTransportModal() {
    setIsTransportModalVisible(!isTransportModalVisible);
  }
  function alert({ title, message }) {
    Alert.alert(title, message, [
      { text: "Voltar à Treap.", onPress: () => {} },
      {
        text: "Terminar mesmo assim.",
        onPress: () => router.replace("/endtreap"),
      },
    ]);
  }
  function onEndTreap() {
    if (completedTreap(pointList)) {
      router.replace("/endtreap");
    } else {
      if (hasNotReachedAnyCheckpointOrDestination(pointList)) {
        alert({
          title: "Não atingiste nenhum checkpoint nem chegaste ao destino. 😔",
          message:
            "Não vais ganhar recompensas e a viagem não vai ser guardada.",
        });
      } else {
        if (wentStraightToDestination(pointList)) {
          alert({
            title: "Chegaste ao destino sem passar por nenhum checkpoint. 😔",
            message:
              "As recompensas atribuídas vão considerar o trajeto percorrido.",
          });
        }
        if (
          hasReachedSomeCheckpoint(pointList) &&
          !pointList[pointList.length - 1].passed
        ) {
          alert({
            title: "Ainda não chegaste ao teu destino. 😔",
            message:
              "Vais ganhar apenas as recompensas até ao último checkpoint atingido.",
          });
        }
      }
    }
  }
  return (
    <>
      {!treapActive && (
        <>
          <MapPanel
            modalVisible={isTransportModalVisible}
            setModalVisible={onTransportModal}
            onMoveTo={onMoveTo}
          />

          <TransportSelectModal
            modalVisible={isTransportModalVisible}
            setModalVisible={onTransportModal}
          />

          <View style={styles.bottomPanel}>
            <MapBottomPanel mapRef={mapRef} />
          </View>
        </>
      )}
      {treapActive && (
        <>
          <TouchableOpacity style={styles.endTreapBtn} onPress={onEndTreap}>
            <Text style={styles.buttonText}>Terminar Treap</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
});

export default Panels;

const styles = StyleSheet.create({
  bottomPanel: {
    position: "absolute", // Adiciona esta linha
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "#fffef6",
  },
  endTreapBtn: {
    position: "absolute",
    bottom: 50,
    left: 30,
    right: 30,
    backgroundColor: "#35a076",
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
