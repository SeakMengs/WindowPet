import { ColorScheme } from "@mantine/core";
import { LazyExoticComponent, MemoExoticComponent } from "react";
import { ISpriteConfig } from "./ISpriteConfig";

export interface IGetAppSetting {
    configName?: string,
    key?: string,
}

export interface ISetSetting extends IGetAppSetting {
    configName?: string,
    key?: string,
    setKey: string,
    newValue: unknown,
}

export type TAppSetting = {
    allowPetAboveTaskbar: boolean,
    allowPetInteraction: boolean,
    language: string,
    theme: ColorScheme
}

export interface IHandleSettingChange {
    (
        dispatchType: string,
        newValue: string | boolean | ISpriteConfig | number,
    ): void;
}

export enum ESettingTab {
    MyPets = 0,
    PetShop = 1,
    Settings = 2,
    About = 3,
}

export interface ISettingTabComponent {
    component: MemoExoticComponent<({ scrollToTop }: { scrollToTop: () => void }) => JSX.Element>,
    title: string,
    description: string,
}

export interface ISettingsContent {
    title: string;
    description: string;
    checked: boolean;
    dispatchType: string;
}