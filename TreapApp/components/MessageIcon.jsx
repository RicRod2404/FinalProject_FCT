import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

export default function MessageIcon({ isDark }) {
  const router = useRouter();
  function handlePress() {
    // Redirecionar para a página de mensagens messages.jsx
    router.push("../DM");
  }
  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <FontAwesome6
          name={"message"}
          size={27}
          color={isDark ? "#fffef6" : "#3f3f3f"}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});