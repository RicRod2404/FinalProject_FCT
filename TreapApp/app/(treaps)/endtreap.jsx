import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import EndTreapModal from "../../components/map/EndTreapModal";

const Endtreap = () => {
  return (
    <SafeAreaView style={styles.container}>
      <EndTreapModal />
    </SafeAreaView>
  );
};

export default Endtreap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9b9b9b",
  },
});
