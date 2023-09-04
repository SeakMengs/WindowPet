import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "./Loading";
import { useSettings } from "./hooks/useSettings";
import { appWindow } from "@tauri-apps/api/window";
import { usePets } from "./hooks/usePets";

const PhaserWrapper = React.lazy(() => import("./PhaserWrapper"));
const SettingWindow = React.lazy(() => import("./SettingWindow"));

function App() {
  useSettings();
  const { isError } = usePets();

  if (isError) return appWindow.close();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhaserWrapper />} />
        <Route path="/setting" element={
          <Suspense fallback={<Loading />}>
          <SettingWindow />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
