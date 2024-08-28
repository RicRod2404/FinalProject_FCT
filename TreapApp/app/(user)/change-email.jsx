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

const ChangeEmail = () => {
  const [form, setForm] = useState({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  function submit() {
    setIsSubmitting(true);
    httpPut("/users/request-email?email=" + form.email, {}).then(
      () => {
        setIsSubmitting(false);
        ToastAndroid.show(
          "Email request sent to the new email",
          ToastAndroid.SHORT
        );
        router.replace("/profile");
      },
      (err) => {
        setIsSubmitting(false);
        ToastAndroid.show("An error occurred" + err, ToastAndroid.LONG);
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
        <Text style={styles.title}>Alterar Email</Text>
        <FormField
          title="Novo Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="novo@gmail.com"
        />
        <CustomButton
          title="Alterar Email"
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
            router.replace("/profile");
          }}
        >
          <Text style={styles.link}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangeEmail;

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
