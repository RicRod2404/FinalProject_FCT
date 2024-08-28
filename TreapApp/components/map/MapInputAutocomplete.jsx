import { StyleSheet } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSelector } from "react-redux";
import { treapSelector } from "../../store/treap";
import { API_MAPS_KEY2 } from "@env";
import Constants from "expo-constants";
const MapInputAutocomplete = ({ placeholder, onPlaceSelected, index }) => {
  const { pointList } = useSelector(treapSelector);
  const name = pointList[index].locationName;
  const apiKey =
    API_MAPS_KEY2 ||
    process.env.API_MAPS_KEY2 ||
    Constants?.manifest2?.extra?.API_MAPS_KEY2;
  return (
    <>
      {apiKey && (
        <GooglePlacesAutocomplete
          styles={styles.searchInput}
          placeholder={name || placeholder}
          fetchDetails
          onPress={(data, details = null) => {
            onPlaceSelected(details);
          }}
          query={{
            key: apiKey,
            language: "pt-pt",
          }}
        />
      )}
    </>
  );
};

export default MapInputAutocomplete;

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});
