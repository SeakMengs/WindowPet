import { create } from "zustand";

interface SettingTabState {
    page: number;
    setPage: (page: number) => void;
}

export const useSettingTabStore = create<SettingTabState>((set) => ({
    page: 0,
    setPage: (page: number) => set({ page }),
}));