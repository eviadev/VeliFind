import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ onPress, style, children }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
    padding: 6,
    borderWidth: 2,
    borderRadius: 15,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "500",
  },
});

export default Button;
