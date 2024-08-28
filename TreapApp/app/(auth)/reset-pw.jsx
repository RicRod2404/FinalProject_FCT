import {
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { httpPut } from "../../utils/http";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  function submit() {
    setIsSubmitting(true);
    httpPut("/users/forgot-password/" + form.email, {}).then(
      () => {
        ToastAndroid.show("Email enviado", ToastAndroid.SHORT);
        router.replace("/reset-pw-email-conf");
      },
      (error) => {
        if (error.status === 404) {
          ToastAndroid.show("Email não encontrado", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Erro a enviar email.", ToastAndroid.SHORT);
        }
      }
    );
  }
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        paddingBottom: 50,
      }}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          minHeight: 85,
          paddingHorizontal: 20,
          paddingTop: 50,
        }}
      >
        <Text style={styles.title}>Reset de Password</Text>
        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="email@gmail.com"
        />
        <CustomButton
          title="Confirmar"
          handlePress={submit}
          containerStyles={{
            marginTop: 10,
            width: "100%",
            alignSelf: "center",
          }}
          isLoading={isSubmitting}
          textStyles={undefined}
        />
        <TouchableOpacity
          onPress={() => {
            router.replace("/sign-in");
          }}
        >
          <Text style={styles.link}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#150f4c",
    marginBottom: 40,
  },
  link: {
    color: "#150f4c",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 20,
  },
});
