import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import TransportButton from "./TransportButton";

const TransportSelectModal = ({ modalVisible, setModalVisible }) => {
  const transportes = [
    {
      text: "A pé",
      icon: "person-walking",
      carbonFootprint: 0,
    },
    {
      text: "Bicicleta",
      icon: "bicycle",
      carbonFootprint: 0,
    },
    {
      text: "Carro",
      icon: "car",
      carbonFootprint: 170,
    },
    /* {
      text: "Carro Elétrico",
      icon: "plug-circle-bolt",
      carbonFootprint: 170,
    }, */
    {
      text: "Transportes Públicos",
      icon: "bus",
      carbonFootprint: 54,
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={setModalVisible}
    >
      <TouchableOpacity
        style={styles.centeredView}
        activeOpacity={1}
        onPress={setModalVisible}
      >
        <View style={styles.modalView}>
          <FlatList
            style={styles.list}
            data={transportes}
            renderItem={({ item }) => (
              <TransportButton
                text={item.text}
                icon={item.icon}
                carbonFootprint={item.carbonFootprint}
                setModalVisible={setModalVisible}
              />
            )}
            keyExtractor={(item) => item.text}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default TransportSelectModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adiciona um fundo semi-transparente
  },
  modalView: {
    width: "95%",
    height: "auto",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 30,
  },
  list: {
    width: "100%",
    display: "flex",
  },
});
