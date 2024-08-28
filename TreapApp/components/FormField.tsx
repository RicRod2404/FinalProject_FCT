import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
type FormFieldProps = {
  title: string;
  value: string;
  handleChangeText: (e: any) => void;
  otherStyles: object;
  keyboardType?: string; // Add this line
  placeholder: string;
  defaultValue?: string;
};
const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  defaultValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  function isPassword() {
    return (
      title === "Password" ||
      title === "Confirma a Password" ||
      title === "Password Atual" ||
      title === "Nova Password" ||
      title === "Confirmar Nova Password"
    );
  }

  return (
    <View style={[styles.view, otherStyles]}>
      <Text style={styles.label}>{title}</Text>
      <View style={[styles.inputView, isFocused && styles.focused]}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#a5a5a5"
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword() && !showPassword}
          defaultValue={defaultValue}
        />
        {isPassword() && value && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 10 }}
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  view: {
    marginTop: 2,
  },
  label: {
    lineHeight: 24,
    fontSize: 16,
    color: "#969ca2",
  },
  inputView: {
    height: 50,
    borderColor: "#d3d5d6",
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 15,
    alignItems: "center",
  },
  input: {
    height: 50,
    fontSize: 16,
  },
  focused: {
    borderColor: "#8d4bf1", // Change border color when focused
  },
});
