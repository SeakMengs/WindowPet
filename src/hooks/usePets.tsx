import { UseQueryResult, useQuery } from "react-query";
import { getAppSettings } from "../utils/settings";
import { useSettingStore } from "./useSettingStore";
import { ISpriteConfig } from "../types/ISpriteConfig";
import { noPetDialog } from "../utils";

const setPets = useSettingStore.getState().setPets;

const getPets = async () => {
    let config: ISpriteConfig[] = await getAppSettings({ configName: "pets.json" });
    if (config.length === 0) {
        noPetDialog();
        return [];
    }
    setPets(config);
};

export function usePets(): UseQueryResult<unknown, Error> {
    return useQuery('pets', getPets, { refetchOnWindowFocus: false });
};