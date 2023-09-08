import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import i18next from "./i18next";
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

// prevent right click menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
