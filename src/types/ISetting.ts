import { ColorScheme } from "@mantine/core";
import { MemoExoticComponent } from "react";

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
    allowPetAboveTaskBar: boolean,
    allowPetInteraction: boolean,
    language: string,
    theme: ColorScheme
}

export interface IHandleSettingChange {
    (
        dispatchType: string,
        newValue: string | boolean,
    ): void;
}

export interface ISettingTabComponent {
    [key: number]: MemoExoticComponent<() => JSX.Element>;
}

export interface ISettingsContent {
    parent: {
        title: string;
        description: string;
    };
    child: {
        title: string;
        description: string;
        checked: boolean;
        dispatchType: string;
    }[];
}