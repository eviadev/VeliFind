import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { AuthProvider } from "./Contexts/AuthContext";
import reportWebVitals from "./reportWebVitals";

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
reportWebVitals();