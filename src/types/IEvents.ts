import { ISpriteConfig } from "./ISpriteConfig";

export type TRenderEventListener = {
    event: string,
    windowLabel: string,
    payload: {
        dispatchType: string,
        message: string,
        value: boolean | string | ISpriteConfig | number,
    },
    id: number,
}

export interface IEmitReRenderPetsEvent {
    dispatchType: string;
    newValue?: boolean | string | ISpriteConfig | number;
}