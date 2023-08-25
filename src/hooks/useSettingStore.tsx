import { create } from "zustand";
import { ColorScheme } from "@mantine/core";
import { getAppSettings } from "../utils/settings";
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
    isAllowHoverOnPet: boolean;
    setIsAllowHoverOnPet: (newBoolean: boolean) => void;
    petConfig: any[];
    setPetConfig: (newConfig: any[]) => void;
}

let [settings, autoStartUpEnabled] = await Promise.all<TAppSetting & boolean>([
    getAppSettings({}),
    isEnabled()
]);

// initialize settings
export const useSettingStore = create<ISettingStore>()((set) => ({
    language: settings.language || "en",
    setLanguage: (newLanguage) => {
        set({ language: newLanguage })
    },
    theme: settings.theme || "dark",
    setTheme: (newTheme) => {
        set({ theme: newTheme })
    },
    isPetAboveTaskBar: settings.isPetAboveTaskbar || false,
    setIsPetAboveTaskbar: (newBoolean) => {
        set({ isPetAboveTaskBar: newBoolean })
    },
    isAutoStartUp: autoStartUpEnabled,
    setIsAutoStartUp: (newBoolean) => {
        set({ isAutoStartUp: newBoolean })
    },
    isAllowHoverOnPet: settings.isAllowHoverOnPet || true,
    setIsAllowHoverOnPet: (newBoolean) => {
        set({ isAllowHoverOnPet: newBoolean })
    },
    petConfig: [],
    setPetConfig: (newConfig) => {
        set({ petConfig: newConfig });
    },
}));