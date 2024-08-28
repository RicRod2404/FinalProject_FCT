import { Text, StyleSheet, View, Image, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector, updateUser } from "../store/session";
import { TouchableOpacity } from "react-native-gesture-handler";
import { httpGet } from "../utils/http";
import { Facebook } from "react-content-loader/native";
import * as Progress from "react-native-progress";
import { formatarPontos } from "../utils/helperFunction";
import { useRouter } from "expo-router";
export const Details = ({ user }) => {
  const { nickname } = useSelector(sessionSelector);
  const { name, leafPoints, isPublic, level, levelExp, levelExpToNextLevel } =
    user;
  const router = useRouter();
  let expProgress = 0.03;
  expProgress = (levelExp / levelExpToNextLevel) * 10;

  return (
    <View style={styles.details}>
      <Text style={styles.name}>{name ? name : nickname}</Text>
      <Text style={styles.userName}>@{nickname}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 15,
        }}
      >
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Nível:</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>LPs:</Text>
          <Text style={styles.statValue}>
            {leafPoints ? formatarPontos(leafPoints) : "0"}
          </Text>
        </View>
      </View>
      <View style={styles.stat}>
        <Progress.Bar
          //TODO: regra 3 simples quando tiver acesso ao xp/level
          progress={expProgress}
          width={150}
          height={10}
          color="#35a076"
        />
      </View>
      <View style={styles.btns}>
        <TouchableOpacity
          style={styles.btnPurpleBorder}
          onPress={() => {
            router.replace("/edit");
          }}
        >
          <FontAwesome6 name="pen" size={15} color="#8d4bf1" />
          <Text style={{ color: "#8d4bf1" }}> Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserDetails = () => {
  const { nickname, profilePic } = useSelector(sessionSelector);
  const [user, setUser] = useState({
    name: "",
    leafPoints: 0,
    isPublic: true,
    level: 0,
    levelExp: 0,
    levelExpToNextLevel: 100,
  });
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    async function f() {
      await onFetchUser();
    }
    f();
  }, []);
  async function onFetchUser() {
    setIsFetching(true);
    //TODO: Não estou a receber os leafpoints
    httpGet("users/" + nickname).then(
      (res) => {
        setUser({
          name: res.data.name,
          leafPoints: res.data.leafPoints,
          isPublic: res.data.isPublic,
          level: res.data.level,
          levelExp: res.data.level,
          levelExpToNextLevel: res.data.levelExpToNextLevel,
        });
        const { profilePic, nickname } = res.data;
        updateUser({ profilePic: profilePic, nickname: nickname });
      },
      (err) => {
        ToastAndroid.show("Error fetching user details", ToastAndroid.LONG);
      }
    );
    setIsFetching(false);
  }
  return (
    <>
      <View style={styles.statsView}>
        {isFetching ? (
          <Facebook />
        ) : (
          <>
            <Image
              style={styles.logo}
              source={{
                uri:
                  profilePic ||
                  "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
              }}
            />
            <Details user={user} />
          </>
        )}
      </View>
    </>
  );
};
export default UserDetails;

const styles = StyleSheet.create({
  statsView: {
    backgroundColor: "#fffef6",
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 5,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  details: {
    marginTop: 20,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#150f4c",
  },
  userName: {
    color: "#3f3f3f",
  },
  stat: {
    flexDirection: "row",
    marginTop: 5,
  },
  statLabel: {
    color: "#150f4c",
    fontWeight: "bold",
  },
  statValue: {
    marginLeft: 5,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 0,
    alignItems: "center",
  },
  btnPurpleBorder: {
    display: "flex",
    borderColor: "#8d4bf1",
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
