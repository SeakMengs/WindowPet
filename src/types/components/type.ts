import { UpdateManifest } from "@tauri-apps/api/updater";
import { ISpriteConfig } from "../ISpriteConfig";

export interface ISettingTabProps {
    Icon: React.ReactNode;
    label: string;
    active: boolean;
    handleSetTab: () => void;
}
export interface ISettingTabsProps {
    activeTab: number;
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
    pet: ISpriteConfig,
    btnFunction: () => void,
    type: PetCardType,
}

export interface SettingSwitchProps {
    title: string,
    description: string,
    checked: boolean,
    dispatchType: string;
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