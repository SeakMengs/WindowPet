export interface IGetAppSetting {
    path?: string,
    key?: string,
}

export interface ISetSetting extends IGetAppSetting {
    setKey: string,
    newValue: unknown,
}

export interface IHandleSettingChange {
    (
        dispatchType: string,
        newValue: string | boolean,
    ): void;
}

export interface ISettingTabComponentInterface {
    [key: number]: () => JSX.Element;
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
}