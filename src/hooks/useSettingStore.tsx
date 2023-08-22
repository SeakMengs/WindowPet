import { create } from "zustand";
import { ColorScheme } from "@mantine/core";

interface ISettingStore {
    language: string;
    setLanguage: (newLanguage: string) => void;
    theme: ColorScheme;
    setTheme: (newTheme: ColorScheme) => void;
    isAutoStartUp: boolean,
    setIsAutoStartUp: (newBoolean: boolean) => void;
    petConfig: any[],
    setPetConfig: (newConfig: any[]) => void;
    isPetAboveTaskBar: boolean,
    setIsPetAboveTaskbar: (newBoolean: boolean) => void;
}

export const useSettingStore = create<ISettingStore>()((set) => ({
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
    petConfig: [],
    setPetConfig: (newConfig) => {
        set({ petConfig: newConfig });
    },
    isPetAboveTaskBar: false,
    setIsPetAboveTaskbar: (newBoolean) => {
        set({ isPetAboveTaskBar: newBoolean })
    }
}));
