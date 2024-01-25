import { useState} from "react";
import {View, Text, TextInput, StyleSheet} from "react-native";
import { useAuth} from "../Contexts/AuthContext";
import StyledButton from "../components/StyledButton";

export const Register = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { onRegister } = useAuth();

  const register = async () => {
    const result = await onRegister!(email, password);
    if (result && result.error) {
      alert(result.msg);
    }
  };

  const handleRedirect = () => {
    navigation.navigate("Login");
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.formContainer}>
          <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text: string) => setEmail(text)}
          />
          <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text: string) => setPassword(text)}
          />
          <View style={styles.buttonsDiv}>
            <StyledButton onPress={handleRedirect} style={styles.button}>Sign in</StyledButton>
            <StyledButton onPress={register} style={styles.button}>Create account</StyledButton>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    width: 280,
  },
  buttonsDiv: {
    gap: 15,
    flexDirection: "row"
  }
});
