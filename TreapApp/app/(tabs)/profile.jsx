import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import LogoutIcon from "../../components/LogoutIcon";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import SettingsIcon from "../../components/SettingsIcon";
import UserDetails from "../../components/UserDetails";
import LastTwoMonthsTreapsComparisonChart from "../../components/charts/Last2MonthsTreapsComparisonChart";
import CurrentMonthCarbonFPLineChart from "../../components/charts/CurrentMonthCarbonFPLineChart";

const Profile = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fffef6" }}>
      <SafeAreaView style={styles.background}>
        <ScrollView>
          <TopBar title={"Eu"}>
            <SettingsIcon />
            <LogoutIcon />
          </TopBar>
          <UserDetails />
          <LastTwoMonthsTreapsComparisonChart />
          <CurrentMonthCarbonFPLineChart />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  background: {
    color: "#fffef6",
  },
});
