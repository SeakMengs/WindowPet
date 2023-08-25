export type TRenderEventListener = {
    event: string,
    windowLabel: string,
    payload: {
        dispatchType: string,
        message: string,
        value: boolean | string,
    },
    id: number,
}

export interface IEmitReRenderPetsEvent {
    dispatchType: string;
    newValue?: boolean | string;
}