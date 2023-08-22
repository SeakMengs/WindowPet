export type TPetState = {
    imageSrc: string;
    framesMax: number;
    stateHold: number;
    framesHold: number;
    image?: HTMLImageElement;
};

export type TStates = {
    [key: string]: TPetState | undefined;
}

export type TCurrentPetState = {
    state: string;
    index?: number;
    stateHold: number;
};

export interface IPetParams {
    position: { x: number; y: number };
    name: string;
    currentState: TCurrentPetState;
    velocity: { x: number; y: number };
    offset: { x: number; y: number };
    scale?: number;
    framesMax?: number;
    framesCurrent?: number;
    framesElapsed?: number;
    framesHold?: number;
    states: TStates;
    walkSpeed?: number;
    runSpeed?: number;
}