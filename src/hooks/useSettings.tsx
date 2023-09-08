import { useQuery } from "react-query";
import { useSettingStore } from "./useSettingStore";
import { getAppSettings } from "../utils/settings";
import { TAppSetting } from "../types/ISetting";
import { isEnabled } from "tauri-plugin-autostart-api";
import i18next from "i18next";

const { setLanguage, setTheme, setAllowAutoStartUp, setAllowPetAboveTaskbar, setAllowPetInteraction, } = useSettingStore.getState();

const getSettings = async () => {
    let setting: TAppSetting = await getAppSettings({ configName: "settings.json" });
    if (setting === undefined) {
        return [];
    }
    if (i18next.language !== setting.language) i18next.changeLanguage(setting.language);
    setLanguage(setting.language);
    setTheme(setting.theme);
    setAllowAutoStartUp(await isEnabled());
    setAllowPetAboveTaskbar(setting.allowPetAboveTaskbar);
    setAllowPetInteraction(setting.allowPetInteraction);
};

export function useSettings() {
    return useQuery('settings', getSettings, { refetchOnWindowFocus: false });
}