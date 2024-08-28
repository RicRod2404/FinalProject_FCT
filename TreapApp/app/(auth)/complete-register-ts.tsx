import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import FormField from "../../components/FormField";
import { useRouter } from "expo-router";
import { httpPut } from "../../utils/http";
import { SafeAreaView } from "react-native";
import { set } from "../../store/snackbar";
import CustomButton from "../../components/CustomButton";
import * as FileSystem from "expo-file-system";
const CompleteRegister = () => {
  const [form, setForm] = useState({
    oldNickname: "",
    nickname: "",
    name: "",
    email: "",
    phoneNum: "",
    address: "",
    postalCode: "",
    nif: "",
    profilePic: "",
    role: "",
    status: "",
    isPublic: true,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const session = useSelector(sessionSelector);
  const router = useRouter();
  async function submit() {
    setIsSubmitting(true);
    const fileUri = FileSystem.documentDirectory + "complete-register.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(form), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    httpPut("users/" + session.nickname, form).then(
      (res) => {
        setIsSubmitting(false);
        httpPut("users/active/" + session.nickname, null).then(() => {
          router.replace("/home");
        });
      },
      (err) => {
        console.error("Error editing user");
        setIsSubmitting(false);
      }
    );
  }

  function skip() {
    httpPut("users/active/" + session.nickname, null).then(() => {
      router.replace("/home");
    });
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            minHeight: 85,
            paddingHorizontal: 20,
            marginTop: 50,
          }}
        >
          <Text style={styles.title}>Completa o teu Registo</Text>
          <FormField
            title="Nome Completo"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles={{ marginTop: 7 }}
            placeholder="Nome Apelido"
          />
          {/* <FormField
            title="Nº de Telemóvel"
            value={form.phoneNum}
            handleChangeText={(e) => setForm({ ...form, phoneNum: e })}
            otherStyles={{ marginTop: 8 }}
            placeholder={"999999999"}
          /> */}
          {/* <PhoneInput
            value={phoneNumber}
            onChangePhoneNumber={(number) => setPhoneNumber(number)}
            onPressFlag={toggleCountryPicker}
            style={styles.phoneInput}
          /> */}
          <FormField
            title="Morada"
            value={form.address}
            handleChangeText={(e) => setForm({ ...form, address: e })}
            otherStyles={{ marginTop: 7 }}
            placeholder="Rua de Sésamo nº 1"
          />
          <FormField
            title="Código Postal"
            value={form.postalCode}
            handleChangeText={(e) => setForm({ ...form, postalCode: e })}
            otherStyles={{ marginTop: 7 }}
            placeholder="1234-567"
          />
          <FormField
            title="Nif"
            value={form.nif}
            handleChangeText={(e) => setForm({ ...form, nif: e })}
            otherStyles={{ marginTop: 7 }}
            placeholder="123456789"
          />
          <CustomButton
            title="Completar Registo"
            handlePress={submit}
            containerStyles={{
              marginTop: 10,
              width: "100%",
              alignSelf: "center",
            }}
            isLoading={isSubmitting}
            textStyles={undefined}
          />
          <CustomButton
            title="Skip"
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
      </ScrollView>
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
});
