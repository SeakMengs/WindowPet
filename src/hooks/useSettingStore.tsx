import { create } from "zustand";
import { ISettingStoreState } from "../types/hooks/type";
import defaultPetConfig from "../config/pet_config";
import defaultSettings from "../../src-tauri/src/app/default/settings.json";
import { ColorScheme } from "../types/ISetting";

// initialize settings
export const useSettingStore = create<ISettingStoreState>()((set) => ({
    language: localStorage.getItem("language") ?? defaultSettings.language,
    setLanguage: (newLanguage) => {
        set({ language: newLanguage })
    },
    theme: localStorage.getItem("theme") as ColorScheme ?? defaultSettings.theme,
    setTheme: (newTheme) => {
        set({ theme: newTheme })
    },
    allowPetAboveTaskbar: defaultSettings.allowPetAboveTaskbar ?? false,
    setAllowPetAboveTaskbar: (newBoolean) => {
        set({ allowPetAboveTaskbar: newBoolean })
    },
    allowAutoStartUp: defaultSettings.allowAutoStartUp ?? false,
    setAllowAutoStartUp: (newBoolean) => {
        set({ allowAutoStartUp: newBoolean })
    },
    allowPetInteraction: defaultSettings.allowPetInteraction ?? true,
    setAllowPetInteraction: (newBoolean) => {
        set({ allowPetInteraction: newBoolean })
    },
    allowPetClimbing: defaultSettings.allowPetClimbing ?? true,
    setAllowPetClimbing: (newBoolean) => {
        set({ allowPetClimbing: newBoolean })
    },
    allowOverridePetScale: defaultSettings.allowPetInteraction ?? true,
    setAllowOverridePetScale: (newBoolean) => {
        set({allowOverridePetScale: newBoolean})
    },
    petScale: defaultSettings.petScale ?? 0.7,
    setPetScale: (petScale) => {
        set({petScale: petScale})
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