import { ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import FormField from "../../components/FormField";
import { useRouter } from "expo-router";
import { httpPut } from "../../utils/http";
import { SafeAreaView } from "react-native";
import CustomButton from "../../components/CustomButton";
import * as FileSystem from "expo-file-system";
import axios from "axios";
const CompleteRegister = () => {
  const session = useSelector(sessionSelector);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function skip() {
    setIsSubmitting(true);
    httpPut("users/active/" + session.nickname, null).then(() => {
      router.replace("/home");
    });
    setIsSubmitting(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          minHeight: 85,
          paddingHorizontal: 20,
          marginTop: 50,
        }}
      >
        <Text style={styles.title}>
          Podes completar o teu Perfil na tua área pessoal.
        </Text>
        <CustomButton
          title="OK! Vamos lá!"
          handlePress={skip}
          containerStyles={{
            marginTop: 10,
            width: "100%",
            alignSelf: "center",
          }}
          isLoading={isSubmitting}
          textStyles={undefined}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20,
          }}
        ></View>
      </View>
    </SafeAreaView>
  );
};

export default CompleteRegister;

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#150f4c",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fffef6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
