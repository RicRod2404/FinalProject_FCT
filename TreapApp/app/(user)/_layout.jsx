import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "./settings";
import Edit from "./edit";
import ChangeEmail from "./change-email";
import ChangePassword from "./change-pw";

const Stack = createStackNavigator();

export default function _UserLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        component={Edit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="change-pw"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="change-email"
        component={ChangeEmail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({});
