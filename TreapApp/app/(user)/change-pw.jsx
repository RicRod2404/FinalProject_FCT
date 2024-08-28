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
import { ScrollView } from "react-native-gesture-handler";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { sessionSelector } from "../../store/session";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const session = useSelector(sessionSelector);
  const [form, setForm] = useState({
    nickname: session.nickname,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  function submit() {
    setIsSubmitting(true);
    httpPut("/users/password", form).then(
      (res) => {
        setIsSubmitting(false);
        ToastAndroid.show("Password changed successfully", ToastAndroid.SHORT);
        router.replace("/profile");
      },
      (error) => {
        setIsSubmitting(false);
        if (error.status === 403) {
          ToastAndroid.show("Invalid credentials", ToastAndroid.LONG);
        } else if (error.status === 400) {
          ToastAndroid.show(
            "Password and Confirm Password do not match",
            ToastAndroid.LONG
          );
        } else if (error.status === 406) {
          ToastAndroid.show(
            "Password is not strong enough. It must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
            ToastAndroid.LONG
          );
        } else {
          ToastAndroid.show("An error occurred", ToastAndroid.LONG);
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
        <Text style={styles.title}>Alterar Password</Text>
        <FormField
          title="Password Atual"
          value={form.oldPassword}
          handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="**********"
        />
        <FormField
          title="Nova Password"
          value={form.newPassword}
          handleChangeText={(e) => setForm({ ...form, newPassword: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="**********"
        />
        <FormField
          title="Confirmar Nova Password"
          value={form.confirmPassword}
          handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          otherStyles={{ marginTop: 7 }}
          placeholder="**********"
        />
        <CustomButton
          title="Alterar Password"
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

export default ChangePassword;

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
