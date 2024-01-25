import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import {ButtonProps} from "../types";


const StyledButton: React.FC<ButtonProps> = ({ onPress, style, children }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonStyle}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
    padding: 6,
    borderWidth: 2,
    borderRadius: 15,
  },
  buttonStyle: {
    textAlign: "center",
    fontWeight: "500"
  },
});

export default StyledButton;
