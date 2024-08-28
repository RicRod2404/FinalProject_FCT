import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const Create = () => {
  const navigation = useNavigation();

  useEffect(() => {
    router.replace("/novatreap");
  }, []);

  return (
    <LoadingSpinner fullPage={true} size="large" message="A Carregar o Mapa" />
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
