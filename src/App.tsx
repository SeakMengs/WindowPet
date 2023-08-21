import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { getAppSettings } from "./utils/settingsHelper";
import { useSettingStore } from "./hooks/useSettingStore";
import { isEnabled } from "tauri-plugin-autostart-api";
import useInit from "./hooks/useInit";

const Canvas = React.lazy(() => import("./Canvas"));
const SettingWindow = React.lazy(() => import("./SettingWindow"));

function App() {
  const { setLanguage, setTheme, setIsAutoStartUp, setIsPetAboveTaskbar } = useSettingStore();

  useInit(async () => {
    const settings = await getAppSettings({ path: "settings.json" });
    setLanguage(settings?.language || 'en');
    setTheme(settings?.theme || 'dark');
    setIsPetAboveTaskbar(settings?.isPetAboveTaskbar || false);
    setIsAutoStartUp(await isEnabled() || false);
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/setting" element={<SettingWindow />} />
      </Routes>
    </Router>
  );
}

export default App;
