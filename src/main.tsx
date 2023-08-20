import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import i18next from "./i18next";
import { I18nextProvider } from 'react-i18next';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
