import { create } from "zustand";

interface ISettingTabState {
    page: number;
    setPage: (page: number) => void;
}

export const useSettingTabStore = create<ISettingTabState>()((set) => ({
    page: 0,
    setPage: (page: number) => set({ page }),
}));