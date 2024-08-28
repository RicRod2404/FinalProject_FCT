import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const HomeSingleWeekStat = ({ name, previous, current }) => {
  const improved = current && previous && current > previous;
  let improvedValue = 0;
  if (current && previous) {
    variationValue = Math.abs(current - previous);
  }

  return (
    <View style={styles.ListItem}>
      <Text style={styles.ItemTitle}>{name}</Text>
      <Text style={styles.ItemValue}>{current ? current : 0}</Text>
      {improvedValue !== 0 ? (
        <Text style={styles.ItemVariation}>
          {improved ? (
            <FontAwesome6
              name={"circle-arrow-up"}
              solid
              size={20}
              color={"#35a076"}
            />
          ) : (
            <FontAwesome6
              name={"circle-arrow-down"}
              size={20}
              color={"#ff3d00"}
            />
          )}{" "}
          <Text>{improvedValue.toString()}</Text>
        </Text>
      ) : (
        <Text style={styles.ItemVariation}>
          <FontAwesome6 name={"minus"} solid size={20} color={"#898891"} /> {""}{" "}
          0
        </Text>
      )}
    </View>
  );
};

export default HomeSingleWeekStat;

const styles = StyleSheet.create({
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
