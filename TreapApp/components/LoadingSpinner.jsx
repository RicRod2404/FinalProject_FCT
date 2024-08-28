import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

const LoadingSpinner = ({
  fullPage,
  message = "",
  size,
  color = "#8d4bf1",
}) => {
  return (
    <>
      {fullPage ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size={size} color={color || "#8d4bf1"} />
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={size} color={color || "#8d4bf1"} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      )}
    </>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffef6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  message: {
    color: "#150f4c",
    fontWeight: "bold",
  },
});
