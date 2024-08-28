import ReactNativePhoneInput from "react-native-phone-input";

const CustomPhoneInput = ({
  value,
  onChangeText,
  onChangeCountry,
  ...props
}) => {
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState(value);

  const handleChangeText = (text) => {
    setPhoneNumber(text);
    onChangeText(text);
  };

  return (
    <ReactNativePhoneInput
      ref={phoneInput}
      initialValue={value}
      setValue={handleChangeText}
      onChangeCountry={onChangeCountry}
      countryPickerProps={{ withFlag: true }}
      withDarkTheme
      withShadow
      autoFocus
      {...props}
    />
  );
};
