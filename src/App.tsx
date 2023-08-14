import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import SettingWindow from "./SettingWindow";
import Canvas from "./Canvas";
import { getAppSettings } from "./utils/settingsHelper";
import { useSettingStore } from "./hooks/useSettingStore";

function App() {

  const { setLanguage, setTheme } = useSettingStore();

  // initialize settings
  useEffect(() => {
    getAppSettings({}).then((settings) => {
      setLanguage(settings.language);
      setTheme(settings.theme);
    });
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
