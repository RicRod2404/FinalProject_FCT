import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { useState } from "react";
import { Link, router } from "expo-router";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { httpGet, httpPut } from "../../utils/http";
import { jwtDecode } from "jwt-decode";
import { login, sessionSelector } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { apiSelector, setMaps } from "../../store/api";
const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const session = useSelector(sessionSelector);
  const api = useSelector(apiSelector);

  useEffect(() => {
    if (session.isLogged && api.maps === "") {
      httpGet("/security").then((res) => {
        dispatch(
          setMaps({
            maps: res.data,
          })
        );
        router.replace("/home");
      });
    }
  }, [session.isLogged, api.maps]);

  function checkForRegister(nickname) {
    httpGet("/users/active/" + nickname).then((res) => {
      if (res.data) router.replace("/home");
      else router.replace("/complete-register");
    });
  }

  const submit = async () => {
    setIsSubmitting(true);
    await httpPut("/security", form).then(
      (res) => {
        let t = jwtDecode(res.headers["authorization"].split(" ")[1]);
        dispatch(
          login({
            email: t.email,
            nickname: t.nickname,
            profilePic: t.profilePic,
            token: res.headers["authorization"],
            role: t.role,
            iat: t.iat,
            exp: t.exp,
            jti: t.jti,
            isLogged: true,
            validated: true,
          })
        );
        setIsSubmitting(false);
        checkForRegister(t.nickname);
      },
      (error) => {
        setIsSubmitting(false);
        const regex403 = /403/;
        const regex423 = /423/;
        if (regex403.test(error.message)) {
          ToastAndroid.show("Credenciais inválidas", ToastAndroid.LONG);
        } else if (regex423.test(error.message)) {
          ToastAndroid.show("Utilizador inativo", ToastAndroid.LONG);
        } else {
          ToastAndroid.show(error.toString(), ToastAndroid.LONG);
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
            minHeight: "85vh",
            paddingHorizontal: 10,
            marginTop: 50,
          }}
        >
          <Image source={images.logo} style={styles.logo} />
          <Text style={styles.title}>Log in</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={{ marginTop: 7 }}
            placeholder="mail@mail.com"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={{ marginTop: 8 }}
            placeholder={"********"}
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles={{
              marginTop: 10,
              width: "100%",
              alignSelf: "center",
            }}
            isLoading={isSubmitting}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <Text style={{ marginTop: 10, color: "#050224" }}>
              Esqueci-me da password.{" "}
              <Link
                href="/reset-pw"
                style={{ color: "#8d4bf1", fontWeight: "bold" }}
              >
                Faz reset aqui!
              </Link>
            </Text>
            <Text style={{ marginTop: 10, color: "#050224" }}>
              Ainda não tens conta?{" "}
              <Link
                href="/sign-up"
                style={{ color: "#8d4bf1", fontWeight: "bold" }}
              >
                Cria uma aqui!
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

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
