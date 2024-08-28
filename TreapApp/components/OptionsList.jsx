import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  ToastAndroid,
} from "react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { httpDelete } from "../utils/http";
import { useSelector } from "react-redux";
import { sessionSelector } from "../store/session";
const OptionsList = () => {
  const router = useRouter();
  const { nickname } = useSelector(sessionSelector);
  function onDeleteUser() {
    httpDelete("/users/" + nickname)
      .then((res) => {
        console.log(res);
        ToastAndroid.show("Conta apagada com sucesso!", ToastAndroid.SHORT);
        router.replace("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        ToastAndroid.show("Erro ao apagar conta!", ToastAndroid.SHORT);
      });
  }
  return (
    <SafeAreaView
      style={{
        height: "90%",
      }}
    >
      <ScrollView>
        <View style={styles.safe}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/edit");
              }}
            >
              <Text style={styles.text}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/change-pw");
              }}
            >
              <Text style={styles.text}>Alterar Palavra Passe</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/change-email");
              }}
            >
              <Text style={styles.text}>Alterar Email</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.danger}>
          <View style={styles.dangerRow}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "!Atenção!",
                  "Tem a certeza que deseja apagar a sua conta? Vais perder todo o teu progresso!",
                  [
                    {
                      text: "Cancelar",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Apagar",
                      onPress: () => {
                        onDeleteUser();
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: "#FFF",
                    fontWeight: "bold",
                  },
                ]}
              >
                Apagar Conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default OptionsList;

const styles = StyleSheet.create({
  safe: {
    paddingTop: 15,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 15,
    borderBottomWidth: 5,
  },
  danger: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    borderRadius: 10,
    borderColor: "#E0E0E0",
    borderBottomWidth: 1,

    padding: 20,
  },
  dangerRow: {
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FF0000",
    width: "90%",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "#000",
  },
});
