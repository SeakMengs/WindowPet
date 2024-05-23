import { useQuery } from "react-query";
import { useSettingStore } from "./useSettingStore";
import { getAppSettings } from "../utils/settings";
import { isEnabled } from "tauri-plugin-autostart-api";
import i18next from "i18next";
import defaultSettings from "../../src-tauri/src/app/default/settings.json";
import { error } from "tauri-plugin-log-api";
import { ISettingStoreVariables } from "../types/hooks/type";

const { setLanguage, setTheme, setAllowAutoStartUp, setAllowPetAboveTaskbar, setAllowPetInteraction, setAllowOverridePetScale, setPetScale, setAllowPetClimbing } = useSettingStore.getState();

const getSettings = async () => {
    let setting: ISettingStoreVariables = await getAppSettings({ configName: "settings.json" });
    
    if (setting === undefined) {
        error("Settings is undefined")
        throw new Error("Settings is undefined");
    }

    if (i18next.language !== setting.language) i18next.changeLanguage(setting.language);
    setLanguage(setting.language ?? defaultSettings.language);
    setTheme(setting.theme ?? defaultSettings.theme);
    setAllowAutoStartUp(await isEnabled());
    setAllowPetAboveTaskbar(setting.allowPetAboveTaskbar ?? defaultSettings.allowPetAboveTaskbar);
    setAllowPetInteraction(setting.allowPetInteraction ?? defaultSettings.allowPetInteraction);
    setAllowPetClimbing(setting.allowPetClimbing ?? defaultSettings.allowPetClimbing);
    setAllowOverridePetScale(setting.allowOverridePetScale ?? defaultSettings.allowOverridePetScale);
    setPetScale(setting.petScale ?? defaultSettings.petScale);
};

export function useSettings() {
    return useQuery('settings', getSettings, { refetchOnWindowFocus: false,
        // disable cache
        cacheTime: 0,
     });
}