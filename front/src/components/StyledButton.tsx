import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const StyledButton: React.FC<ButtonProps> = ({ onPress, style, children }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
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
  buttonText: {
    textAlign: "center",
    fontWeight: "500"
  },
});

export default StyledButton;
