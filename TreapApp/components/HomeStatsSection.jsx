import { Text, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { httpGet } from "../utils/http";

import {
  getWeekOfMonth,
  getWeekOfPreviousMonth,
} from "../utils/helperFunction";
import LoadingSpinner from "./LoadingSpinner";
import HomeSingleWeekStat from "./HomeSingleWeekStat";
const HomeStatsSection = () => {
  const [previousWeekStats, setPreviousWeekStats] = useState();
  const [currentWeekStats, setCurrentWeekStats] = useState();
  const [isFetchingStatistics, setIsFetchingStatistics] = useState(false);
  useEffect(() => {
    if (!isFetchingStatistics) onFetchStatistics();
  }, [isFetchingStatistics]);
  function onFetchWeekStats(flag) {
    let weekOfMonth = getWeekOfMonth();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    if (flag === "previous") {
      if (weekOfMonth === 1) {
        weekOfMonth = getWeekOfPreviousMonth();
        month = month === 0 ? 12 : month - 1;
        year = month === 12 ? year - 1 : year;
      } else {
        weekOfMonth = weekOfMonth - 1;
      }
    }
    httpGet("/statistics/weekly", {
      weekOfMonth: weekOfMonth,
      month: month,
      year: year,
    })
      .then((res) => {
        if (res.data) {
          const { treaps, carbonFootprint, steps } = res.data.weeklyStatistics;
          if (flag === "current") {
            setCurrentWeekStats({
              treaps: treaps,
              carbonFootprint: carbonFootprint,
              steps: steps,
            });
          }
          if (flag === "previous") {
            setPreviousWeekStats({
              treaps: treaps,
              carbonFootprint: carbonFootprint,
              steps: steps,
            });
          }
        } else {
          console.log("No statistics found for the week: " + weekOfMonth);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          console.log("No statistics found for the week: " + weekOfMonth);
        }
      });
  }
  async function onFetchStatistics() {
    setIsFetchingStatistics(true);
    onFetchWeekStats("previous");
    onFetchWeekStats("current");
    setIsFetchingStatistics(false);
  }
  return (
    <View style={styles.statsView}>
      {isFetchingStatistics ? (
        <LoadingSpinner fullPage={false} />
      ) : (
        <>
          <Text style={styles.statsTitle}>Estatísticas Semanais</Text>
          <View style={styles.List}>
            <HomeSingleWeekStat
              name="Trajetos"
              previous={previousWeekStats ? previousWeekStats?.treaps : null}
              current={currentWeekStats ? currentWeekStats?.treaps : null}
            />
            <HomeSingleWeekStat
              name="Pegada de Carbono"
              previous={
                previousWeekStats ? previousWeekStats?.carbonFootprint : null
              }
              current={
                currentWeekStats
                  ? Math.ceil(currentWeekStats?.carbonFootprint)
                  : null
              }
            />
            <HomeSingleWeekStat
              name="Passos"
              previous={previousWeekStats ? previousWeekStats?.steps : null}
              current={currentWeekStats ? currentWeekStats?.steps : null}
            />
          </View>
        </>
      )}
    </View>
  );
};
export default HomeStatsSection;

const styles = StyleSheet.create({
  statsView: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 30,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 5,
  },
  statsTitle: {
    color: "#150f4c",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  List: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  ListItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    gap: 5,
  },
  ItemTitle: {
    fontSize: 16,
    fontWeight: "regular",
    color: "#858b91",
  },
  ItemValue: {
    fontSize: 30,
    fontWeight: "900",
    color: "#8d4bf1",
  },
  ItemValueUnits: {
    fontSize: 10,
    color: "#3f3f3f",
  },
  ItemVariation: {
    fontSize: 16,
    color: "#150f4c",
    paddingLeft: 5,
    fontWeight: "bold",
  },
});
