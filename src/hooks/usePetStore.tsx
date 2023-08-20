import { create } from "zustand";
import { CurrentPetState, States } from "../Class/type";

export type TPet = {
    position: { x: number; y: number };
    name: string;
    velocity: { x: number; y: number };
    offset: { x: number; y: number };
    states: States;
    stateNumber: number;
    currentState: CurrentPetState;
    image: HTMLImageElement;
    imageSrc: string;
    scale: number;
    framesMax: number;
    framesCurrent: number;
    framesElapsed: number;
    framesHold: number;
    movingDirection: 'left' | 'right';
    walkSpeed: number;
    runSpeed: number;
    isBeingSelected: boolean;
    draw: (context: CanvasRenderingContext2D, flipImage: boolean) => void;
    animateFrames: () => void;
    checkCollisionWithCanvas: (context: CanvasRenderingContext2D) => void;
    update: (context: CanvasRenderingContext2D) => void;
    switchState: (state: string) => void;
    animateBehavior: () => void;
    generateOneRandomState: () => void;
};

interface PetStore {
    pets: TPet[];
    clonePets: (pets: TPet[]) => void;
    addPet: (pet: TPet) => void;
    clearPets: () => void;
    isPetsInitialized: boolean;
    setIsPetsInitialized: (value: boolean) => void;
}

export const usePetStore = create<PetStore>((set) => ({
    pets: [],
    clonePets: (pets: TPet[]) => {
        set({ pets: [...pets] });
    },
    addPet: (pet: TPet) => {
        set((state) => ({ pets: [...state.pets, pet] }));
    },
    clearPets: () => {
        set({ pets: [] });
    },
    isPetsInitialized: false,
    setIsPetsInitialized: (value: boolean) => {
        set({ isPetsInitialized: value });
    }
}));