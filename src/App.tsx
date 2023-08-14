import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import SettingWindow from "./SettingWindow";
import Canvas from "./Canvas";
import { getAppSettings } from "./utils/settingsHelper";
import { useSettingStore } from "./hooks/useSettingStore";
import { isEnabled } from "tauri-plugin-autostart-api";

function App() {

  const { setLanguage, setTheme, setIsAutoStartUp } = useSettingStore();

  // initialize settings
  useEffect(() => {
    getAppSettings({}).then((settings) => {
      setLanguage(settings.language);
      setTheme(settings.theme);
    });

    isEnabled().then((enabled) => {
        setIsAutoStartUp(enabled);
    })
  }, []);

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
