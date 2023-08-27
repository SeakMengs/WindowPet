import { create } from "zustand";
import { ISettingTabState } from "../types/hooks/type";

export const useSettingTabStore = create<ISettingTabState>()((set) => ({
    page: 0,
    setPage: (page: number) => set({ page }),
}));