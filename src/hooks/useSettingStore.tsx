import { create } from "zustand";
import { ISettingStoreState } from "../types/hooks/type";
import { ColorScheme } from "@mantine/core";
import defaultPetConfig from "../config/pet_config.json";

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
    // this pets will be used to track the pets in user's computer and live update the pet if user add/remove pet
    pets: [],
    setPets: (newPets) => {
        set({ pets: [...newPets] })
    },
    // default pet config that will be used in the pet shop.
    defaultPet: JSON.parse(JSON.stringify(defaultPetConfig)),
    setDefaultPet: (newDefaultPet) => {
        set({ defaultPet: [...newDefaultPet] })
    },
}));