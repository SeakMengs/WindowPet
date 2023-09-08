import { UseQueryResult, useQuery } from "react-query";
import { getAppSettings } from "../utils/settings";
import { WebviewWindow } from '@tauri-apps/api/window';
import { confirm } from "@tauri-apps/api/dialog";
import { useSettingStore } from "./useSettingStore";
import { ISpriteConfig } from "../types/ISpriteConfig";

const setPets = useSettingStore.getState().setPets;

const getPets = async () => {
    let config: ISpriteConfig[] = await getAppSettings({ configName: "pets.json" });
    if (config.length === 0) {
        confirm("Nya~ Oh, dear friend! In this whimsical realm of mine, where magic and wonder intertwine, alas, there are no delightful pets to be found. But fret not! Fear not! For you hold the power to change this tale. Simply venture into the enchanting settings and add a touch of furry companionship to make our world even more adorable and divine! Onegai~", { title: "WindowPet Dialog", type: 'info' }).then((ok) => {
            // close the pet window
            WebviewWindow.getByLabel('main')?.close();
            return [];
        });
    }
    setPets(config);
};

export function usePets(): UseQueryResult<unknown, Error> {
    return useQuery('pets', getPets, { refetchOnWindowFocus: false });
};