import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './utils';
import {SCREENS} from './screens';
import { Home } from "../screens/Home";
import { Login } from "../screens/Login";
import { Register } from "../screens/Register";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName={SCREENS.HOME}>
      <Stack.Screen name={SCREENS.HOME} component={Home} />
      <Stack.Screen name={SCREENS.LOGIN} component={Login} />
      <Stack.Screen name={SCREENS.REGISTER} component={Register} />
    </Stack.Navigator>
  );
};

const linking = {
  prefixes: [],
  config: {
    screens: {
      [SCREENS.HOME]: "",
      [SCREENS.LOGIN]: "login",
      [SCREENS.REGISTER]: "register",
    },
  },
};

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking} {...props}>
      <AppStack />
    </NavigationContainer>
  );
};
