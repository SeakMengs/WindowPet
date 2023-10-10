import { UseQueryResult, useQuery } from "react-query";
import { getAppSettings, setConfig } from "../utils/settings";
import { useSettingStore } from "./useSettingStore";
import { ISpriteConfig } from "../types/ISpriteConfig";
import { noPetDialog } from "../utils";

const setPets = useSettingStore.getState().setPets;

const getPets = async () => {
    let saveConfigAgain = false;
    const pets: ISpriteConfig[] = await getAppSettings({ configName: "pets.json" });
    if (pets.length === 0) {
        noPetDialog();
        return [];
    }

    // check if all pets has unique id if no add id and after all check, save config again
    pets.forEach((pet: ISpriteConfig) => {
        if (!pet.id) {
            pet.id = crypto.randomUUID();
            saveConfigAgain = true;
        }
    });

    if (saveConfigAgain) setConfig({ configName: "pets.json", newConfig: pets });
    
    setPets(pets);
};

export function usePets(): UseQueryResult<unknown, Error> {
    return useQuery('pets', getPets, { refetchOnWindowFocus: false });
};