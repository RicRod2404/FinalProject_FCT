import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const ResetPWConfEmail = () => {
  const handleResendEmail = () => {
    // Função para reenviar o email de confirmação
    console.log("Reenviar email de confirmação");
  };

  return (
    <View style={styles.container}>
      <FontAwesome6 name={"envelope"} size={150} color="#150f4c" />
      <Text style={styles.confirmationText}>
        Foi enviado um email de confirmação
      </Text>
      <Text style={styles.subText}>Não recebeste?</Text>
      <TouchableOpacity onPress={handleResendEmail}>
        <Text style={styles.resendLink}>Reenviar email de confirmação</Text>
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Text style={{ marginTop: 10, color: "#050224" }}>
          Voltar à página de{" "}
          <Link
            href="/sign-in"
            style={{ color: "#8d4bf1", fontWeight: "bold" }}
          >
            login.
          </Link>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  resendLink: {
    fontSize: 14,
    color: "#8A2BE2",
    textAlign: "center",
  },
});

export default ResetPWConfEmail;
