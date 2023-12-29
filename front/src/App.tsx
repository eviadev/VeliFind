import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { Home } from "./screens/Home";

const Stack = createNativeStackNavigator();
const App: React.FC = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

export const Layout = () => {
  const { authState, onLogout } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={authState ? "Home" : "Login"}>
        {authState?.authenticated ? (
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Homepage",
              headerStyle: {
                backgroundColor: "#f4511e",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerRight: () => (
                <Pressable onPress={onLogout}>Sign out</Pressable>
              ),
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
            <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
