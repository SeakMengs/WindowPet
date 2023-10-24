
import { create } from "zustand";
import { IPetStateStore } from "../types/hooks/type";

export const usePetStateStore = create<IPetStateStore>((set) => ({
    petStates: {},
    setPetStates: (newPetStates) => {
        set({ petStates: newPetStates })
    },
    storeDictPetStates(petName, petState) {
        set(state => ({
            petStates: {
                ...state.petStates,
                [petName]: petState,
            }
        }))
    },
}));