export interface GetAppSetting {
    path?: string,
    key?: string,
}

export interface SetSetting extends GetAppSetting {
    setKey: string,
    newValue: unknown,
}

export interface HandleSettingChange {
    (
        dispatchType: string,
        newValue: string | boolean,
    ): void;
}

export interface SettingTabComponentInterface {
    [key: number]: () => JSX.Element;
}

export type Theme = 'dark' | 'light';

export interface SettingsContent {
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