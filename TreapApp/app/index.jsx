import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, sessionSelector } from "../store/session";
import { useEffect } from "react";
import { httpGet } from "../utils/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import AnimatedLogo from "../components/AnimatedLogo";
import { apiSelector, setMaps } from "../store/api";
import { usePushNotifications } from "./notifications/usePushNotifications";
export default function App() {
  
  const dispatch = useDispatch();
  const router = useRouter();
  const session = useSelector(sessionSelector);
  const api = useSelector(apiSelector);

  useEffect(() => {
    const fetchToken = async () => {
      let token = await AsyncStorage.getItem("token");
      if (token !== null) {
        let t = jwtDecode(token.split(" ")[1]);
        if (t.exp * 1000 > Date.now()) {
          dispatch(
            login({
              email: t.email,
              nickname: t.nickname,
              profilePic: t.profilePic,
              token: token,
              role: t.role,
              iat: t.iat,
              exp: t.exp,
              jti: t.jti,
              isLogged: true,
              validated: true,
            })
          );
          if (session.isLogged && session.validated) {
            router.replace("/home"); // Redireciona para /home
          }
        } else {
          dispatch(logout());
          router.replace("/sign-in");
        }
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!session.validated && session.isLogged) {
      httpGet("/users/" + session.email)
        .then(() => {
          dispatch(
            login({
              ...session,
              validated: true,
            })
          );
        })
        .catch(() => {
          dispatch(logout());
          router.replace("/sign-in");
        });
    }
  }, [session.validated]);
  useEffect(() => {
    if (session.isLogged) {
      router.replace("/home");
    }
  }, [session.isLogged]);

  useEffect(() => {
    if (session.isLogged && api.maps === "") {
      httpGet("/security").then((res) => {
        dispatch(
          setMaps({
            maps: res.data,
          })
        );
      });
    }
  }, [session.isLogged, api.maps]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "85vh",
            paddingHorizontal: "4px",
          }}
        >
          <AnimatedLogo />
          <View style={{ position: "relative", marginTop: 5 }}>
            <Text style={styles.title}>
              <Text style={{ color: "#35a076", fontWeight: "900" }}>Faz</Text> a
              tua{" "}
              <Text style={{ color: "#8d4bf1", fontWeight: "900" }}>
                escolha
              </Text>
              .{" "}
              <Text style={{ color: "#8d4bf1", fontWeight: "900" }}>Segue</Text>{" "}
              a tua{" "}
              <Text style={{ color: "#35a076", fontWeight: "900" }}>Treap</Text>
              .
            </Text>
          </View>
          <Text style={styles.comment}>
            Desafia-te por um planeta e uma vida mais sustentável.
          </Text>
          <CustomButton
            title="Começar"
            handlePress={() => router.replace("/sign-in")}
            containerStyles={{ width: "70%", marginTop: 20 }}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#fffef6" style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffef6",
    height: "100%",
    fontFamily: "Poppins-Regular",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#050224",
  },
  scrollView: {
    height: "100%",
  },
  comment: {
    fontSize: 15,
    textAlign: "center",
    color: "#050224",
    marginTop: 20,
    paddingHorizontal: 80,
  },
});
