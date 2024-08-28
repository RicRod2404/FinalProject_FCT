import { StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, containerStyles, isLoading && { opacity: 0.5 }]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner fullPage={false} size={"large"} color="#fffef6" />
      ) : (
        <Text style={[styles.text, textStyles]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8d4bf1",
    width: 200,
    minHeight: 60,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
