import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router, useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../../store/session";
import { httpPost } from "../../utils/http";
import { useState } from "react";
const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const session = useSelector(sessionSelector);
  const router = useRouter();
  const params = useLocalSearchParams<{ nickname: string }>();
  const submit = () => {
    setIsLoading(true);

    // Send form
    httpPost("/users", form).then(
      () => {
        ToastAndroid.show("Utilizador criado com sucesso.", ToastAndroid.SHORT);
        router.replace(`/email-conf?email=${form.email}`);
      },
      (error) => {
        setIsLoading(false);
        const regex406 = /406/;
        const regex409 = /409/;
        const regex400 = /400/;
        const regex403 = /403/;
        if (regex409.test(error.message)) {
          ToastAndroid.show("Utilizador já existe.", ToastAndroid.SHORT);
        } else if (regex400.test(error.message)) {
          ToastAndroid.show("Campos inválidos.", ToastAndroid.SHORT);
        } else if (regex403.test(error.message)) {
          ToastAndroid.show(
            "Password e Confirm Password não são iguais.",
            ToastAndroid.SHORT
          );
        } else if (regex406.test(error.message)) {
          ToastAndroid.show(
            "A Password não é forte o suficiente ou contem caracteres inválidos.",
            ToastAndroid.SHORT
          );
        } else {
          ToastAndroid.show("Erro a criar utilizador.", ToastAndroid.SHORT);
        }
      }
    );
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            minHeight: 85,
            paddingHorizontal: 10,
            marginTop: 50,
          }}
        >
          <Image source={images.logo} style={styles.logo} />
          <Text style={styles.title}>Registo </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginTop: 7 }}
            keyboardType="email-address"
            placeholder="email@domain.com"
          />
          <FormField
            title="Nickname"
            value={form.nickname}
            handleChangeText={(e) => setForm({ ...form, nickname: e })}
            otherStyles={{ marginTop: 7 }}
            keyboardType="default"
            placeholder="nickname"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={{ marginTop: 8 }}
            placeholder={"********"}
          />
          <FormField
            title="Confirma a Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles={{ marginTop: 8 }}
            placeholder={"********"}
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={{
              marginTop: 10,
              width: "100%",
              alignSelf: "center",
            }}
            textStyles={{
              color: "white",
              fontSize: 16,
            }}
            isLoading={isLoading}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 10, color: "#050224" }}>
              Já tens conta?{" "}
              <Link
                href="/sign-in"
                style={{ color: "#8d4bf1", fontWeight: "bold" }}
              >
                Faz login aqui!
              </Link>
            </Text>
            <Text
              style={{
                paddingHorizontal: 50,
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              Ao criares conta, concordas com os nossos{" "}
              <Link href="" style={{ fontWeight: "bold" }}>
                Termos e condições.
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: -10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#150f4c",
    marginBottom: 20,
  },
});
