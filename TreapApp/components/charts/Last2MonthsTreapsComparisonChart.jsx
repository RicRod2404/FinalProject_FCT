import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import LoadingSpinner from "../LoadingSpinner";
import { httpGet } from "../../utils/http";
const LastTwoMonthsTreapsComparisonChart = () => {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [data, setData] = useState([
    {
      value: 0,
      label: "A Pé",
      spacing: 4,
      labelWidth: 100,
      labelTextStyle: { color: "#150f4c" },
      frontColor: "#35a076",
      barWidth: 10,
    },
    { value: 0, frontColor: "#8d4bf1" },
    {
      value: 0,
      label: "Bicicleta",
      spacing: 4,
      labelWidth: 100,
      labelTextStyle: { color: "#150f4c" },
      frontColor: "#35a076",
      barWidth: 10,
    },
    { value: 0, frontColor: "#8d4bf1" },
    {
      value: 0,
      label: "T.Públicos",
      spacing: 4,
      labelWidth: 100,
      labelTextStyle: { color: "#150f4c" },
      frontColor: "#35a076",
      barWidth: 10,
    },
    { value: 0, frontColor: "#8d4bf1" },
    {
      value: 0,
      label: "Carro/mota",
      spacing: 4,
      labelWidth: 100,
      labelTextStyle: { color: "#150f4c" },
      frontColor: "#35a076",
      barWidth: 10,
    },
    { value: 0, frontColor: "#8d4bf1" },
  ]);
  //Get highest value from data
  let maxValue = Math.max(...data.map((item) => item.value));
  useEffect(() => {
    if (!isFetchingData) {
      onFetchMonthlyStats("current");
      onFetchMonthlyStats("previous");
    }
    setIsFetchingData(false);
  }, [isFetchingData]);
  function thereIsData() {
    return data.some((item) => item.value > 0);
  }

  function onFetchMonthlyStats(flag) {
    setIsFetchingData(true);
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    if (flag === "previous") {
      month = month === 1 ? 12 : month - 1;
      year = month === 12 ? year - 1 : year;
    }
    httpGet("/statistics/monthly", {
      month: month,
      year: year,
    })
      .then((res) => {
        if (res.data) {
          const { stopsByFoot, stopsByCar, stopsByTransports, stopsByBike } =
            res.data?.monthlyStatistics;
          if (flag === "current") {
            setData((currentData) =>
              currentData.map((item, index) => {
                switch (index) {
                  case 0:
                    return { ...item, value: stopsByFoot };
                  case 2:
                    return { ...item, value: stopsByBike };
                  case 4:
                    return { ...item, value: stopsByTransports };
                  case 6:
                    return { ...item, value: stopsByCar };
                  default:
                    return item; // Retorna o item sem modificações se não corresponder aos casos acima
                }
              })
            );
          } else if (flag === "previous") {
            setData((previousData) =>
              previousData.map((item, index) => {
                switch (index) {
                  case 1:
                    return { ...item, value: stopsByFoot };
                  case 3:
                    return { ...item, value: stopsByBike };
                  case 5:
                    return { ...item, value: stopsByTransports };
                  case 7:
                    return { ...item, value: stopsByCar };
                  default:
                    return item; // Retorna o item sem modificações se não corresponder aos casos acima
                }
              })
            );
          } else {
            console.log("Flag not valid: " + flag);
          }
          setHasData(thereIsData());
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          console.log("No statistics found for the month: " + month);
        }
      });
    setIsFetchingData(false);
  }

  return (
    <>
      {!isFetchingData && data.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.title}>
            Treap realizadas:{"\n"}
            <Text style={{ color: "#8d4bf1" }}>Mês Anterior</Text>
            <Text> vs </Text>
            <Text
              style={{
                color: "#35a076",
              }}
            >
              Mês Atual
            </Text>
          </Text>
          <View style={styles.container}>
            {isFetchingData ? (
              <LoadingSpinner />
            ) : (
              <>
                {maxValue ? (
                  <BarChart
                    adjustToWidth={false}
                    data={data}
                    barWidth={30}
                    spacing={30}
                    roundedTop
                    roundedBottom
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: "gray" }}
                    noOfSections={4}
                    maxValue={maxValue + 10}
                  />
                ) : null}
              </>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default LastTwoMonthsTreapsComparisonChart;

const styles = StyleSheet.create({
  chartContainer: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#150f4c",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
