import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import OptionsList from "../../components/OptionsList";
const Settings = () => {
  return (
    <SafeAreaView style={styles.background}>
      <TopBar title={"Definições"}></TopBar>
      <OptionsList />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  background: {
    color: "#fffef6",
    backgroundColor: "#fffef6",
    flex: 1,
  },
});
