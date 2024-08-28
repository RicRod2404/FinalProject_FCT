import { StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import NovaTreap from "./novatreap";
import Endtreap from "./endtreap";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function _TreapLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="novatreap"
        component={NovaTreap}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="endtreap"
        component={Endtreap}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({});
