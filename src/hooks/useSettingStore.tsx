import { create } from "zustand";
import { ISettingStoreState } from "../types/hooks/type";
import { ColorScheme } from "@mantine/core";

// initialize settings
export const useSettingStore = create<ISettingStoreState>()((set) => ({
    language: localStorage.getItem("language") || "en",
    setLanguage: (newLanguage) => {
        set({ language: newLanguage })
    },
    theme: localStorage.getItem("theme") as ColorScheme ||"dark",
    setTheme: (newTheme) => {
        set({ theme: newTheme })
    },
    allowPetAboveTaskbar: false,
    setAllowPetAboveTaskbar: (newBoolean) => {
        set({ allowPetAboveTaskbar: newBoolean })
    },
    allowAutoStartUp: false,
    setAllowAutoStartUp: (newBoolean) => {
        set({ allowAutoStartUp: newBoolean })
    },
    allowPetInteraction: true,
    setAllowPetInteraction: (newBoolean) => {
        set({ allowPetInteraction: newBoolean })
    },
    // not actual settings that was saved in the config file
    pets: [],
    setPets: (newPets) => {
        set({ pets: [...newPets] })
    },
}));