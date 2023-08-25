import Pet from "../class/Pet";
import { usePetStore } from "../hooks/usePetStore";
import { getAppSettings } from "./settings";

export const clonePetsFromSettings = async () => {
    const clonePets = usePetStore.getState().clonePets;
    const petConfigs = await getAppSettings({ configName: "pets.json" });
    const tempPets: Pet[] = [];

    for (let petConfig of petConfigs) {
        tempPets.push(new Pet(petConfig));
    }

    clonePets(tempPets);
};

