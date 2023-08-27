import { ColorScheme } from "@mantine/core";

export interface ISettingStoreState {
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
}

export interface ISettingTabState {
    page: number;
    setPage: (page: number) => void;
}