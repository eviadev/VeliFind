import 'react-native';
import React from 'react';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    defaults: { headers: { common: {} } },
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  NavigationContainer: ({ children }) => <>{children}</>,
}));

jest.mock('@react-navigation/native-stack', () => ({
  __esModule: true,
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  __esModule: true,
  SafeAreaProvider: ({ children }) => <>{children}</>,
  initialWindowMetrics: null,
}));

import App from './App';

it('renders correctly', () => {
  expect(() => App({})).not.toThrow();
});
