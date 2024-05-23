import { create } from "zustand";
import { ESettingTab } from "../types/ISetting";

interface ISettingTabState {
    activeTab: number;
    setActiveTab: (activeTab: number) => void;
}

export const useSettingTabStore = create<ISettingTabState>()((set) => ({
    activeTab: ESettingTab.MyPets,
    setActiveTab: (activeTab: number) => set({ activeTab }),
}));