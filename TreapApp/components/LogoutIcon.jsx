import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";
import { logout, sessionSelector } from "../store/session";
export default function LogoutIcon({ isDark }) {
  const dispatch = useDispatch();
  const session = useSelector(sessionSelector);
  function onLogout() {
    dispatch(logout());
  }
  return (
    <TouchableOpacity onPress={onLogout}>
      <View>
        <FontAwesome6
          name={"arrow-right-from-bracket"}
          size={27}
          color={isDark ? "#fffef6" : "#3f3f3f"} //nao funciona a troca de cor
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
