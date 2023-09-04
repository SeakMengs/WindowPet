import { useQuery } from "react-query";
import { useSettingStore } from "./useSettingStore";
import { getAppSettings } from "../utils/settings";
import { TAppSetting } from "../types/ISetting";
import { isEnabled } from "tauri-plugin-autostart-api";

const { setLanguage, setTheme, setallowAutoStartUp, setallowPetAboveTaskBar, setallowPetInteraction, } = useSettingStore.getState();

const getSettings = async () => {
    let setting: TAppSetting = await getAppSettings({ configName: "settings.json" });
    if (setting === undefined) {
        return [];
    }
    setLanguage(setting.language);
    setTheme(setting.theme);
    setallowAutoStartUp(await isEnabled());
    setallowPetAboveTaskBar(setting.allowPetAboveTaskBar);
    setallowPetInteraction(setting.allowPetInteraction);
};

export function useSettings() {
    return useQuery('settings', getSettings, { refetchOnWindowFocus: false });
}