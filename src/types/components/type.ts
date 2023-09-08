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

export interface IPetCardProps {
    btnLabel: string,
    pet: ISpriteConfig,
    btnFunction: () => void,
}