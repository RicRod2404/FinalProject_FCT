import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const NoFeedMessage = () => {
  return (
    <>
      <Text style={styles.noTreaps}>Ainda não tens Treaps...</Text>
      <Text style={styles.noTreaps}>
        Faz a tua primeira em{" "}
        <FontAwesome6 name={"circle-dot"} size={20} color={"#150f4c"} />{" "}
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Começar
        </Text>
      </Text>
    </>
  );
};

export default NoFeedMessage;

const styles = StyleSheet.create({
  noTreaps: {
    textAlign: "center",
    fontSize: 15,
    color: "#150f4c",
    marginTop: 40,
  },
});
