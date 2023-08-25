import { WebviewWindow } from '@tauri-apps/api/window'
import { IEmitReRenderPetsEvent } from '../types/IEvents';

export const emitReRenderPetsEvent = async ({dispatchType, newValue}: IEmitReRenderPetsEvent) => {
    // get the window instance by its label
    const mainWindow = WebviewWindow.getByLabel('main');

    if (mainWindow) {
        await mainWindow.emit('render', {
            message: 'Hey, re-render pets! :)',
            dispatchType: dispatchType,
            value: newValue
        });
    }
};