import { ColorScheme } from "../ISetting";
import { ISpriteConfig } from "../ISpriteConfig";

export interface ISettingStoreState {
    language: string;
    setLanguage: (newLanguage: string) => void;
    theme: ColorScheme;
    setTheme: (newTheme: ColorScheme) => void;
    allowPetAboveTaskbar: boolean;
    setAllowPetAboveTaskbar: (newBoolean: boolean) => void;
    allowAutoStartUp: boolean;
    setAllowAutoStartUp: (newBoolean: boolean) => void;
    allowPetInteraction: boolean;
    setAllowPetInteraction: (newBoolean: boolean) => void;
    allowOverridePetScale: boolean;
    setAllowOverridePetScale: (newBoolean: boolean) => void;
    petScale: number;
    setPetScale: (petScale: number) => void;
    pets: ISpriteConfig[];
    setPets: (newPets: ISpriteConfig[]) => void;
    defaultPet: ISpriteConfig[];
    setDefaultPet: (newDefaultPet: ISpriteConfig[]) => void;
}

export interface ISettingTabState {
    page: number;
    setPage: (page: number) => void;
}

export interface IPetStateStore {
    petStates: Record<string, Array<string>>;
    setPetStates: (newPetStates: Record<string, Array<string>>) => void;
    storeDictPetStates: (petName: string, petState: Array<string>) => void;
}