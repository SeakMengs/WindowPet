import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SettingWindow from "./SettingWindow";
import Canvas from "./Canvas";
import { getAppSettings } from "./utils/settingsHelper";
import { useSettingStore } from "./hooks/useSettingStore";
import { isEnabled } from "tauri-plugin-autostart-api";
import useInit from "./hooks/useInit";

function App() {
  const { setLanguage, setTheme, setIsAutoStartUp, setIsPetAboveTaskbar } = useSettingStore();

  useInit(async () => {
    const settings = await getAppSettings({ path: "settings.json" });
    setLanguage(settings?.language);
    setTheme(settings?.theme);
    setIsPetAboveTaskbar(settings?.isPetAboveTaskbar);
    setIsAutoStartUp(await isEnabled());
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
