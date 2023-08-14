import { create } from "zustand";
import { ColorScheme } from "@mantine/core";

interface SettingStore {
    language: string;
    setLanguage: (newLanguage: string) => void;
    theme: ColorScheme;
    setTheme: (newTheme: ColorScheme) => void;
    isAutoStartUp: boolean,
    setIsAutoStartUp: (newBoolean: boolean) => void;
}

export const useSettingStore = create<SettingStore>()((set) => ({
    language: 'en',
    setLanguage: (newLanguage) => {
        set({ language: newLanguage })
    },
    theme: 'dark',
    setTheme: (newTheme) => {
        set({ theme: newTheme })
    },
    isAutoStartUp: false,
    setIsAutoStartUp: (newBoolean) => {
        set({ isAutoStartUp: newBoolean })
    },
}));
