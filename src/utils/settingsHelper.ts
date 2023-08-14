import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { Store } from "tauri-plugin-store-api";
import { GetAppSetting, SetSetting } from "./type";
import { configDir } from "@tauri-apps/api/path"

export function toggleAutoStartUp(isAutoStartUp: boolean) {
    (async () => {
        const hasEnabledStartUp = await isEnabled();

        if (isAutoStartUp) {
            if (hasEnabledStartUp) return;
            await enable();
            return;
        }

        if (hasEnabledStartUp) {
            await disable();
        }
    })()
};

export async function getAppSettings({ path = "settings.json", key = "app" }: GetAppSetting) {
    const configDirPath = await configDir();
    const store = new Store(`${configDirPath}WindowPet/${path}`)
    const settings: any = await store.get(key);
    return settings;
}

export function setSettings({ path = "settings.json", key = "app", setKey, newValue }: SetSetting) {
    (async () => {
        let setting: any = await getAppSettings({});
        setting[setKey] = newValue;
        const configDirPath = await configDir();
        const store = new Store(`${configDirPath}WindowPet/${path}`)
        await store.set(key, setting);
        await store.save();
    })()
}