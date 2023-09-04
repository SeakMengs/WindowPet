import { create } from "zustand";
import { ISettingStoreState } from "../types/hooks/type";

// initialize settings
export const useSettingStore = create<ISettingStoreState>()((set) => ({
    language: "en",
    setLanguage: (newLanguage) => {
        set({ language: newLanguage })
    },
    theme: "dark",
    setTheme: (newTheme) => {
        set({ theme: newTheme })
    },
    allowPetAboveTaskBar: false,
    setallowPetAboveTaskBar: (newBoolean) => {
        set({ allowPetAboveTaskBar: newBoolean })
    },
    allowAutoStartUp: false,
    setallowAutoStartUp: (newBoolean) => {
        set({ allowAutoStartUp: newBoolean })
    },
    allowPetInteraction: true,
    setallowPetInteraction: (newBoolean) => {
        set({ allowPetInteraction: newBoolean })
    },
    // not actual settings that was saved in the config file
    pets: [],
    setPets: (newPets) => {
        set({ pets: [...newPets] })
    },
}));