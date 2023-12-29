import React, {useEffect, useState} from "react";
import {View, Text, TextInput, StyleSheet, Button} from "react-native";
import axios from "axios";
import {API_URL, useAuth} from "../Contexts/AuthContext";

export const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { onRegister } = useAuth();

  const register = async () => {
    const result = await onRegister!(email, password);
    if (result && result.error) {
      alert(result.msg);
    }
  };

  useEffect(() => {
    const testCall = async () => {
      const result = await axios.get(`${API_URL}/users`);
      console.log("testcall:", result)
    }
    testCall()
  }, [])

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
          <Button onPress={register} title="Create account" />
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
    width: 300,
  },
});
