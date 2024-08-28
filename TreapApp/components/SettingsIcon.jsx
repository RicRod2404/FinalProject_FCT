import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

export default function SettingsIcon({ isDark }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/settings");
      }}
    >
      <View>
        <FontAwesome6
          name={"gear"}
          size={27}
          color={isDark ? "#fffef6" : "#3f3f3f"} //nao funciona a troca de cor
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
