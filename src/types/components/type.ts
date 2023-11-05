import { UpdateManifest } from "@tauri-apps/api/updater";
import { ISpriteConfig } from "../ISpriteConfig";
import { ISettingTabs } from "../ISetting";
import { DispatchType } from "../IEvents";

export interface ISettingTabProps {
    Icon: React.ReactNode;
    label: string;
    active: boolean;
    handleSetTab: () => void;
}
export interface ISettingTabsProps {
    activeTab: number;
    settingTabs: ISettingTabs[];
}

export interface ITitleProps {
    title: string;
    description: string;
}

export enum PetCardType {
    Add = "add",
    Remove = "remove",
}

export interface IPetCardProps {
    btnLabel: string,
    btnLabelCustom?: string,
    pet: ISpriteConfig,
    btnFunction: () => void,
    btnFunctionCustom?: () => void,
    type: PetCardType,
}

export interface SettingSwitchProps {
    title: string,
    description: string,
    checked: boolean,
    dispatchType: DispatchType,
    component?: React.ReactNode,
}

export interface SettingButtonProps {
    title: string,
    description: string,
    btnLabel: string,
    btnFunction: () => void,
}

export interface PhaserCanvasProps {
    pet: ISpriteConfig,
    playState: string,
}

export interface UpdaterPopupProps {
    shouldUpdate: boolean,
    manifest: UpdateManifest | undefined,
}