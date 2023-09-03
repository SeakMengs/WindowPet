export interface ISettingTabProps {
    Icon: React.ReactNode;
    label: string;
    active: boolean;
    handleSetTab: () => void;
}

export interface ISettingTabsProps {
    activeTab: number;
    setActiveTab: (tab: number) => void;
}