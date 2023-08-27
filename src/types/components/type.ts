export interface ISettingTabProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    index: number;
    handleSetTab: (index: number) => void;
}