import { useQuery } from "@tanstack/react-query";
import { useSettingStore } from "./useSettingStore";
import { getAppSettings } from "../utils/settings";
import { isEnabled } from "@tauri-apps/plugin-autostart";
import i18next from "i18next";
import defaultSettings from "../../src-tauri/src/app/default/settings.json";
import { error } from "@tauri-apps/plugin-log";
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
    return setting;
};

export function useSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: getSettings,
        refetchOnWindowFocus: false,
        // disable cache
        gcTime: 0,
    });
}
