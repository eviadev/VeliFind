import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import axios from "axios";
import { API_URL, useAuth } from "../Contexts/AuthContext";
import StyledButton from "../components/StyledButton";

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { onLogin } = useAuth();

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.get(`${API_URL}/users`);
      console.log("testcall:", result);
    };
    testCall();
  }, []);

  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error) {
      alert(result.msg);
    }
  };
  const handleRedirect = () => {
    navigation.navigate("Register", {login});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      </View>
      <View style={styles.buttonsDiv}>
        <StyledButton onPress={handleRedirect} style={styles.button}>
          Create account
        </StyledButton>
        <StyledButton onPress={login} style={styles.button}>
          Sign in
        </StyledButton>
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
  errorText: {
    color: "red",
    marginTop: 8,
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    width: 280,
  },
  buttonsDiv: {
    gap: 15,
    flexDirection: "row",
  },
});
