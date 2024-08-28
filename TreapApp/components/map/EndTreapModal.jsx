import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import EndTreapButtonsPanel from "./EndTreapButtonsPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTotalCarbonFootprint,
  selectTotalDistance,
  selectTotalDuration,
  selectTotalLeafPoints,
  setPointList,
  treapSelector,
} from "../../store/treap";
import {
  formatarDistancia,
  formatarDuracao,
  formatarPegadadeCarbono,
  formatarPontos,
} from "../../utils/helperFunction";
import {
  completedTreap,
  fetchStats,
  getLastPointCoordinates,
  hasNotReachedAnyCheckpointOrDestination,
  wentStraightToDestination,
} from "../../utils/mapFunctions";
import LoadingSpinner from "../LoadingSpinner";
const EndTreapModal = () => {
  const src = {
    uri: "https://storage.googleapis.com/treapapp.appspot.com/frontend-source/logoGold.png",
  };
  const distance = useSelector(selectTotalDistance);
  const duration = useSelector(selectTotalDuration);
  const carbonFootprint = useSelector(selectTotalCarbonFootprint);
  const leafPoints = useSelector(selectTotalLeafPoints);
  const { pointList } = useSelector(treapSelector);
  const [isCalculatingStats, setIsCalculatingStats] = React.useState(true);
  const [canSend, setCanSend] = React.useState(true);
  const [stats, setStats] = React.useState({
    distance: -1,
    duration: -1,
    carbonFootprint: -1,
    leafPoints: -1,
  });
  const [simplePointList, setSimplePointList] = React.useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    async function onCalculate() {
      if (isCalculatingStats) {
        await calculateTreapStats();
      }
    }
    onCalculate();
  }, [isCalculatingStats]);

  async function calculateTreapStats() {
    if (pointList) {
      if (hasNotReachedAnyCheckpointOrDestination(pointList)) {
        setStats({
          distance: 0,
          duration: 0,
          carbonFootprint: 0,
          leafPoints: 0,
        });
        setCanSend(false);
      }
      if (completedTreap(pointList)) {
        setStats({
          distance: distance,
          duration: duration,
          carbonFootprint: carbonFootprint,
          leafPoints: leafPoints,
        });
      } else {
        if (wentStraightToDestination(pointList)) {
          const {
            newDistance,
            newDuration,
            newCarbonFootprint,
            newLeafPoints,
          } = await fetchStats(
            {
              latitude: pointList[0].latitude,
              longitude: pointList[0].longitude,
            },
            getLastPointCoordinates(pointList),
            pointList[0].transport,
            pointList[0].carbonFootprint
          );
          setStats({
            distance: newDistance,
            duration: newDuration,
            carbonFootprint: newCarbonFootprint,
            leafPoints: newLeafPoints,
          });
        } else {
          /////////////////////////////////////////////////////////////////////////////////
          // Terminou viagem a meio. I.e não chegou ao destino mas passou em checkpoints
          /////////////////////////////////////////////////////////////////////////////////
          //1)Remover pontos não atingidos e remover stats do ultimo ponto
          let filteredPointList = pointList.filter((point) => point.passed);
          //2) Limpar params do último ponto
          const newPointList = filteredPointList.map((point, index, array) => {
            if (index === array.length - 1) {
              return {
                ...point,
                transport: "",
                distance: 0,
                duration: 0,
                carbonFootprint: 0,
                leafPoints: 0,
              };
            } else {
              return point;
            }
          });
          //3Re-calcular distância, duração, pegada de carbono e pontos
          let compoundDistance = 0;
          let compoundDuration = 0;
          let compoundCarbonFootprint = 0;
          let compoundLeafPoints = 0;
          for (let i = 0; i < newPointList.length - 1; i++) {
            const {
              newDistance,
              newDuration,
              newCarbonFootprint,
              newLeafPoints,
            } = await fetchStats(
              {
                latitude: newPointList[i].latitude,
                longitude: newPointList[i].longitude,
              },
              {
                latitude: newPointList[i + 1].latitude,
                longitude: newPointList[i + 1].longitude,
              },
              newPointList[i].transport,
              newPointList[i].carbonFootprint
            );
            compoundDistance += newDistance;
            compoundDuration += newDuration;
            compoundCarbonFootprint += newCarbonFootprint;
            compoundLeafPoints += newLeafPoints;
          }
          setStats({
            distance: compoundDistance,
            duration: compoundDuration,
            carbonFootprint: compoundCarbonFootprint,
            leafPoints: compoundLeafPoints,
          });
          dispatch(setPointList(newPointList));
          setIsCalculatingStats(false);
        }
      }
    }
    setSimplePointList(
      pointList
        .filter((point) => point.passed)
        .map((point) => ({
          latitude: point.latitude,
          longitude: point.longitude,
          transport: point.transport,
        }))
    );
    setIsCalculatingStats(false);
  }
  return (
    <>
      {isCalculatingStats && stats ? (
        <LoadingSpinner
          fullPage={true}
          size="large"
          message="A calcular estatísticas..."
        />
      ) : (
        <Modal animationType="slide" transparent={true} visible={true}>
          <TouchableOpacity style={styles.centeredView} activeOpacity={1}>
            <View style={styles.modalView}>
              <Image source={src} style={styles.icon} />
              <Text style={styles.title}>Fim da Treap</Text>
              <View style={styles.stats}>
                <Text style={{ color: "#35a076", fontWeight: "bold" }}>
                  Co2e total:{" "}
                  {stats?.carbonFootprint >= 0
                    ? formatarPegadadeCarbono(stats.carbonFootprint)
                    : "Carregando..."}
                </Text>
                <Text style={{ color: "#fffef6" }}>
                  Distância:{" "}
                  {stats?.distance >= 0
                    ? formatarDistancia(stats.distance)
                    : "Carregando..."}
                </Text>
                <Text style={{ color: "#fffef6" }}>
                  Duração:{" "}
                  {stats?.duration >= 0
                    ? formatarDuracao(stats.duration)
                    : "Carregando..."}
                </Text>
                <Text style={{ color: "#fffef6" }}>
                  LeafPoints:{" "}
                  {stats?.leafPoints >= 0
                    ? formatarPontos(stats.leafPoints)
                    : "Carregando..."}
                </Text>
                <Text style={{ color: "#fffef6" }}>
                  Experiência:{" "}
                  {stats?.leafPoints >= 0
                    ? Math.ceil(stats.leafPoints * 1.2)
                    : "Carregando..."}
                </Text>
              </View>
              <EndTreapButtonsPanel
                canSend={canSend}
                stats={stats}
                simplePointList={simplePointList}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

export default EndTreapModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adiciona um fundo semi-transparente
  },
  modalView: {
    width: "90%",
    height: "70%",
    backgroundColor: "#150f4c",
    borderRadius: 10,
    padding: 30,
    paddingTop: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 40,
    color: "#fffef6",
    fontWeight: "bold",
    paddingVertical: 20,
  },
  icon: {
    width: 100,
    height: 100,
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
});
