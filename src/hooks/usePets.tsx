import { UseQueryResult, useQuery } from "react-query";
import { getAppSettings, setConfig } from "../utils/settings";
import { useSettingStore } from "./useSettingStore";
import { ISpriteConfig, SpriteType } from "../types/ISpriteConfig";
import { convertFileToAssetProtocol, noPetDialog } from "../utils";
import { DefaultConfigName } from "../types/ISetting";
import defaultPetConfig from "../config/pet_config";

const { setPets, setDefaultPet } = useSettingStore.getState();

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
    return useQuery('pets', getPets, { refetchOnWindowFocus: false, 
        // disable cache
        cacheTime: 0,
     });
};

const getDefaultPets = async () => {
    const defaultPets: ISpriteConfig[] = JSON.parse(JSON.stringify(defaultPetConfig));
    const customPets = await getAppSettings({ configName: DefaultConfigName.PET_LINKER, withErrorDialog: false });

    if (customPets && customPets.length > 0) {
        for (const petPath of customPets) {
            const pet: ISpriteConfig = await getAppSettings({ configName: petPath, withErrorDialog: false });
            if (!pet) continue;
            
            pet.type = SpriteType.CUSTOM;
            defaultPets.push(pet);
        }
    }

    setDefaultPet(defaultPets);
};

export function useDefaultPets(): UseQueryResult<unknown, Error> {
    return useQuery('defaultPets', getDefaultPets, { refetchOnWindowFocus: false,
        // disable cache
        cacheTime: 0,
     });
}