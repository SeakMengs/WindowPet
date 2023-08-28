import { ColorScheme } from "@mantine/core";

export interface ISettingStoreState {
    language: string;
    setLanguage: (newLanguage: string) => void;
    theme: ColorScheme;
    setTheme: (newTheme: ColorScheme) => void;
    allowPetAboveTaskBar: boolean;
    setallowPetAboveTaskBar: (newBoolean: boolean) => void;
    allowAutoStartUp: boolean;
    setallowAutoStartUp: (newBoolean: boolean) => void;
    allowPetInteraction: boolean;
    setallowPetInteraction: (newBoolean: boolean) => void;
}

export interface ISettingTabState {
    page: number;
    setPage: (page: number) => void;
}