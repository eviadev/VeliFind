import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import useLogin from "../hooks/useLogin";


export const Login = () => {
  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
});
