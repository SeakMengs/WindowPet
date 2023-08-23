import { create } from "zustand";
import { ColorScheme } from "@mantine/core";
import { getAppSettings } from "../utils/settingsHelper";
import { TAppSetting } from "../types/ISetting";
import { isEnabled } from "tauri-plugin-autostart-api";

interface ISettingStore {
    language: string;
    setLanguage: (newLanguage: string) => void;
    theme: ColorScheme;
    setTheme: (newTheme: ColorScheme) => void;
    isPetAboveTaskBar: boolean;
    setIsPetAboveTaskbar: (newBoolean: boolean) => void;
    isAutoStartUp: boolean;
    setIsAutoStartUp: (newBoolean: boolean) => void;
    petConfig: any[];
    setPetConfig: (newConfig: any[]) => void;
}

let [settings, autoStartUpEnabled] = await Promise.all<TAppSetting & boolean>([
    getAppSettings({}),
    isEnabled()
]);

// initialize settings
export const useSettingStore = create<ISettingStore>()((set) => ({
    language: settings.language,
    setLanguage: (newLanguage) => {
        set({ language: newLanguage })
    },
    theme: settings.theme,
    setTheme: (newTheme) => {
        set({ theme: newTheme })
    },
    isPetAboveTaskBar: settings.isPetAboveTaskbar,
    setIsPetAboveTaskbar: (newBoolean) => {
        set({ isPetAboveTaskBar: newBoolean })
    },
    isAutoStartUp: autoStartUpEnabled,
    setIsAutoStartUp: (newBoolean) => {
        set({ isAutoStartUp: newBoolean })
    },
    petConfig: [],
    setPetConfig: (newConfig) => {
        set({ petConfig: newConfig });
    },
}));