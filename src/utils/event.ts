import { WebviewWindow } from '@tauri-apps/api/window'
import { DispatchType, EventType } from '../types/IEvents';
import { ISpriteConfig } from '../types/ISpriteConfig';

interface IEmitReRenderPetsEvent {
    dispatchType: DispatchType;
    newValue?: boolean | string | ISpriteConfig | number;
}

export const emitUpdatePetsEvent = async ({dispatchType, newValue}: IEmitReRenderPetsEvent) => {
    // get the window instance by its label
    const mainWindow = WebviewWindow.getByLabel('main');

    if (mainWindow) {
        await mainWindow.emit(EventType.SettingWindowToPetOverlay, {
            message: 'Hey, re-render pets! :)',
            dispatchType: dispatchType,
            value: newValue
        });
    }
};