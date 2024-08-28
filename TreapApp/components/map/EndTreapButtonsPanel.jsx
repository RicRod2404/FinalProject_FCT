import {
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  resetTreap,
  selectSimplePointList,
  selectTotalCarbonFootprint,
  selectTotalDistance,
  selectTotalDuration,
  selectTotalLeafPoints,
  treapSelector,
} from "../../store/treap";
import { httpPost } from "../../utils/http";
import { sessionSelector } from "../../store/session";
import LoadingSpinner from "../LoadingSpinner";
const EndTreapButtonsPanel = ({ canSend, stats, simplePointList }) => {
  const { distance, duration, carbonFootprint, leafPoints } = stats;
  const session = useSelector(sessionSelector);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  async function onSaveTreap() {
    ToastAndroid.show("A guardar Treap...", ToastAndroid.SHORT);
    setIsSubmitting(true);
    const form = {
      nickname: session.nickname,
      distance: distance,
      duration: duration,
      carbonFootprint: carbonFootprint,
      leafPoints: leafPoints,
      pointList: simplePointList,
    };
    await httpPost("/treaps", form).then(
      (response) => {
        ToastAndroid.show("Treap guardada com sucesso", ToastAndroid.SHORT);
        setIsSubmitting(false);
        setConfirmed(true);
        dispatch(resetTreap());
      },
      (error) => {
        setIsSubmitting(false);
        if (error.status === 403) {
          console.log("Erro 403");
        }
      }
    );
  }
  return (
    <View style={styles.buttonPanel}>
      {!confirmed && canSend ? (
        <>
          {!isSubmitting && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ff3d00" }]}
              onPress={() => {
                setConfirmed(true);
                dispatch(resetTreap());
                console.log("Treap descartada");
              }}
            >
              <Text style={styles.buttonText}>Descartar Treap</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={onSaveTreap}>
            {isSubmitting ? (
              <LoadingSpinner fullPage={false} size={"large"} color="#fffef6" />
            ) : (
              <Text style={styles.buttonText}>Guardar Treap</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(resetTreap());
              router.replace("/novatreap");
            }}
          >
            <Text style={styles.buttonText}>Nova Treap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(resetTreap());
              console.log("Fim da Treap");
              router.replace("/home");
            }}
          >
            <Text style={styles.buttonText}>Início</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default EndTreapButtonsPanel;

const styles = StyleSheet.create({
  buttonPanel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 20,
  },
  button: {
    backgroundColor: "#35a076",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "50%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fffef6",
    fontWeight: "bold",
    fontSize: 12,
  },
});
