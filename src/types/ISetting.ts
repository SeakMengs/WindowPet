import { MemoExoticComponent } from "react";

export interface IGetAppSetting {
    withErrorDialog?: boolean,
    configName?: string,
    key?: string,
}

export enum ColorSchemeType {
    Light = "light",
    Dark = "dark",
}

export type ColorScheme = ColorSchemeType.Light | ColorSchemeType.Dark;

export enum ESettingTab {
    MyPets = 0,
    PetShop = 1,
    AddPet = 2,
    Settings = 3,
    About = 4,
}

export interface ISettingTabs {
    Component: MemoExoticComponent<() => JSX.Element>,
    title: string,
    description: string,
    Icon: React.ReactNode;
    label: string;
    tab: ESettingTab,
}

export enum DefaultConfigName {
    PET_LINKER = "pet_linker.json",
}