import React from "react";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { AuthProvider } from "./Contexts/AuthContext";
import { AppNavigator } from "./navigators/AppNavigator";

const App: React.FC = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
