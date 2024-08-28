import {
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { httpGet } from "../../utils/http";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { sessionSelector, updateUser } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import * as FileSystem from "expo-file-system";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
const Edit = () => {
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
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
    leafPoints: 0,
    isPublic: true,
    level: 0,
    bannerPic: "",
    profilePicDeleted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  //Fetch user details on mount
  useEffect(() => {
    async function f() {
      await onFetchUser();
    }
    f();
  }, []);

  //Access file system to get image
  async function handleFileInputChangeasync() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  function deleteImage() {
    setImage(null);
    setForm((prev) => ({ ...prev, profilePic: "", profilePicDeleted: true }));
  }
  async function onFetchUser() {
    setIsFetching(true);
    httpGet("users/" + session.nickname).then(
      (res) => {
        setForm({
          ...res.data,
          oldNickname: res.data.nickname,
          profilePicDeleted: false,
        });
        const { nickname, profilePic } = res.data;
        dispatch(updateUser({ nickname: nickname, profilePic: profilePic }));
      },
      (err) => {
        ToastAndroid.show("Error fetching user details", ToastAndroid.LONG);
      }
    );
    setIsFetching(false);
    setIsSubmitting(false);
  }
  async function submit() {
    setIsSubmitting(true);
    const fileUri = FileSystem.documentDirectory + "edit-user.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(form), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const formData = new FormData();
    formData.append("form", {
      uri: fileUri,
      name: "edit-user.json",
      type: "application/json",
    });

    if (image) {
      formData.append("profilePic", {
        uri: image.uri,
        name: image.fileName,
        type: image.mimeType,
      });
    }

    const response = await axios
      .put("/users/" + session.nickname, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(
        async () => {
          ToastAndroid.show(
            "Utilizador editado com sucesso",
            ToastAndroid.SHORT
          );
          await onFetchUser();
          router.replace("/profile");
        },
        (error) => {
          if (error.status === 400) {
            ToastAndroid.show("Erro de pedido", ToastAndroid.LONG);
          } else if (error.status === 404) {
            ToastAndroid.show("Utilizador não encontrado", ToastAndroid.LONG);
          } else if (error.status === 403) {
            ToastAndroid.show("Erro de autorização", ToastAndroid.LONG);
          } else if (error.status === 401) {
            ToastAndroid.show("Erro de autenticação", ToastAndroid.LONG);
          }
        }
      );
    setIsSubmitting(false);
  }
  useEffect(() => {}, [form.profilePic]);
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
        <Text style={styles.title}>Editar Utilizador</Text>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={handleFileInputChangeasync}
        >
          <Image
            style={styles.logo}
            source={{
              uri:
                image?.uri ||
                form?.profilePic ||
                session.profilePic ||
                "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
            }}
          />
          <FontAwesome6
            style={{ right: -50, top: -100 }}
            name="camera"
            size={24}
            color="grey"
          />
        </TouchableOpacity>
        <FormField
          title="Nickname"
          value={form.nickname}
          handleChangeText={(e) => setForm({ ...form, nickname: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder={"Nickname"}
          defaultValue={form.oldNickname || "Nickname"}
        />
        <FormField
          title="Nome"
          value={form.name}
          handleChangeText={(e) => setForm({ ...form, name: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="Nome Apelido"
          defaultValue={form?.name ? form.name : ""}
        />
        <FormField
          title="Morada"
          value={form.address}
          handleChangeText={(e) => setForm({ ...form, address: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="Rua de Sésamo nº 1"
          defaultValue={form?.address ? form.address : ""}
        />
        <FormField
          title="Código Postal"
          value={form.postalCode}
          handleChangeText={(e) => setForm({ ...form, postalCode: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="1234-567"
          defaultValue={form.postalCode ? form.postalCode : ""}
        />
        <FormField
          title="Nif"
          value={form.nif}
          handleChangeText={(e) => setForm({ ...form, nif: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="123456789"
          defaultValue={form.nif ? form.nif : ""}
        />

        <CustomButton
          title="Guardar Informações"
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
          title="Remover Foto de Perfil"
          handlePress={deleteImage}
          containerStyles={{
            marginTop: 10,
            width: "100%",
            alignSelf: "center",
            color: "red",
          }}
          isLoading={isSubmitting}
          textStyles={{
            color: "white",
          }}
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

export default Edit;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#150f4c",
    marginBottom: 10,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 20,
  },
  link: {
    color: "#150f4c",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 20,
  },
});
