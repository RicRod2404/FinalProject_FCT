import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useCarbonData } from "../../hooks/useCarbonData";
import ContentLoader from "react-content-loader/native";
import { useEffect, useState } from "react";
export default CurrentMonthCarbonFPLineChart = () => {
  /* const { isFetchingData, previousMonthData, currentMonthData } =
    useCarbonData();
  const [isReady, setIsReady] = useState(false);
  console.log("previousMonthData: ", previousMonthData);
  console.log("currentMonthData: ", currentMonthData); */
  const isFetchingData = false;
  const array1 = [
    { value: 150 },
    { value: 1000 },
    { value: 950 },
    { value: 1100 },
    { value: 1050 },
    { value: 1200 },
    { value: 1150 },
    { value: 2000 },
    { value: 2250 },
    { value: 2400 },
    { value: 2300 },
    { value: 2450 },
    { value: 1650 },
    { value: 1600 },
    { value: 1550 },
    { value: 1700 },
    { value: 1650 },
    { value: 550 },
    { value: 700 },
    { value: 650 },
    { value: 800 },
    { value: 750 },
    { value: 900 },
    { value: 850 },
    { value: 1850 },
    { value: 2000 },
    { value: 1100 },
    { value: 1050 },
    { value: 1501 },
    { value: 1100 },
  ];

  const array2 = [
    { value: 1700 },
    { value: 1600 },
    { value: 1750 },
    { value: 2250 },
    { value: 2150 },
    { value: 2300 },
    { value: 2200 },
    { value: 2350 },
    { value: 1900 },
    { value: 1800 },
    { value: 1950 },
    { value: 1850 },
    { value: 2000 },
    { value: 1900 },
    { value: 2050 },
    { value: 1950 },
    { value: 2100 },
    { value: 1300 },
    { value: 1250 },
    { value: 1400 },
    { value: 1350 },
    { value: 1500 },
    { value: 1450 },
    { value: 1800 },
    { value: 1700 },
    { value: 1850 },
    { value: 1750 },
    { value: 2150 },
    { value: 2050 },
    { value: 2200 },
    { value: 2100 },
  ];
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>
        Carbono emitido g/km:{"\n"}
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
      {isFetchingData ? (
        <ContentLoader />
      ) : (
        <LineChart
          data={array2}
          data2={array1}
          height={250}
          spacing={10}
          initialSpacing={0}
          color1="#8d4bf1"
          color2="#35a076"
          textColor1="green"
          dataPointsHeight={6}
          dataPointsWidth={1}
          dataPointsColor1="#35a076"
          dataPointsColor2="#8d4bf1"
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={13}
        />
      )}
    </View>
  );
};

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
