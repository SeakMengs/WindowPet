import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { appConfigDir } from '@tauri-apps/api/path';
import { exists  } from '@tauri-apps/api/fs';
import { Store } from "tauri-plugin-store-api";
import defaultSettings from "../settings/defaultSettings.json";

export interface ISetting {
    language: string,
    theme: 'light' | 'dark',
}

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

export async function getAppSettings() {
    const store = new Store("settings.json")
    const settings: ISetting | null = await store.get("app");
    return settings;
}

export async function setSettings(key: string, newValue: unknown) {
    let setting: any = await getAppSettings();
    setting[key] = newValue; 
    const store = new Store("settings.json")
    await store.set("app", setting);
    await store.save();
}

export async function createDefaultSettingsIfNotExist() {
    const configDirPath = await appConfigDir();
    const settingsFilePath = `${configDirPath}settings.json`;
    const fileExists = await exists(settingsFilePath);

    if (!fileExists) {
        const store = new Store("settings.json")
        await store.set("app", defaultSettings);
        await store.save();
    }
}