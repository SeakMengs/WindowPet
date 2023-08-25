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
    isPetAboveTaskbar: boolean,
    isAllowHoverOnPet: boolean,
    language: string,
    theme: ColorScheme
}

export interface IHandleSettingChange {
    (
        dispatchType: string,
        newValue: string | boolean,
    ): void;
}

export interface ISettingTabComponentInterface {
    [key: number]: MemoExoticComponent<() => JSX.Element>;
}

export type Theme = 'dark' | 'light';

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

export interface ISettingTabProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    index: number;
    handleSetTab: (index: number) => void;
}