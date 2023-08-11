import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";

export async function toggleAutoStartUp(isAutoStartUp: boolean) {
    const hasEnabledStartUp = await isEnabled();

    if (isAutoStartUp) {
        if (hasEnabledStartUp) return;
        await enable();
        return;
    }

    if (hasEnabledStartUp) {
        await disable();
    }
};