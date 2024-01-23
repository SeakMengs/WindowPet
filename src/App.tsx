import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "./Loading";
import { useSettings } from "./hooks/useSettings";
import { appWindow } from "@tauri-apps/api/window";
import { useDefaultPets, usePets } from "./hooks/usePets";
import { confirm } from "@tauri-apps/api/dialog";
import { MantineProvider } from "@mantine/core";
import { PrimaryColor } from "./utils";
import { ColorSchemeType } from "./types/ISetting";

const PhaserWrapper = React.lazy(() => import("./PhaserWrapper"));
const SettingWindow = React.lazy(() => import("./SettingWindow"));

function App() {
  useSettings();
  useDefaultPets();
  const { isError, error } = usePets();

  if (isError) {
    confirm(`Error: ${error.message}`, {
      title: 'WindowPet Dialog',
      type: 'error',
    }).then((ok) => {
      if (ok !== undefined) {
        appWindow.close();
      }
    });
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhaserWrapper />} />
        <Route path="/setting" element={
          <Suspense fallback={<Loading />}>
            <MantineProvider
              defaultColorScheme={ColorSchemeType.Dark}
              theme={{
                fontFamily: 'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
                colors: {
                  dark: [
                    "#C1C2C5",
                    "#A6A7AB",
                    "#909296",
                    "#5C5F66",
                    "#373A40",
                    "#2C2E33",
                    // shade
                    "#1A1B1E",
                    // background
                    "#141517",
                    "#1A1B1E",
                    "#101113",
                  ],
                },
                primaryColor: PrimaryColor,
              }} >
              <SettingWindow />
            </MantineProvider>
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;