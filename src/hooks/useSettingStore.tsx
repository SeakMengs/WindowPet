import { create } from "zustand";
import { getAppSettings } from "../utils/settings";
import { TAppSetting } from "../types/ISetting";
import { isEnabled } from "tauri-plugin-autostart-api";
import { ISettingStoreState } from "../types/hooks/type";

let [settings, autoStartUpEnabled] = await Promise.all<TAppSetting & boolean>([
    getAppSettings({}),
    isEnabled()
]);

// initialize settings
export const useSettingStore = create<ISettingStoreState>()((set) => ({
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
}));