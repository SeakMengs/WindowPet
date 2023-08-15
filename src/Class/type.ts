export type PetState = {
    imageSrc: string;
    framesMax: number;
    stateHold: number;
    framesHold: number;
    image?: HTMLImageElement;
};

export type States = {
    [key: string]: PetState | undefined;
}

export type CurrentPetState = {
    state: string;
    index?: number;
    stateHold: number;
};

export interface PetParams {
    position: { x: number; y: number };
    name: string;
    currentState: CurrentPetState;
    velocity: { x: number; y: number };
    offset: { x: number; y: number };
    scale?: number;
    framesMax?: number;
    framesCurrent?: number;
    framesElapsed?: number;
    framesHold?: number;
    states: States;
    walkSpeed?: number;
    runSpeed?: number;
}