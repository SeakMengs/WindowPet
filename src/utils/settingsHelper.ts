import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { Store } from "tauri-plugin-store-api";
import { IGetAppSetting, ISetSetting } from "../types/ISetting";
import { configDir } from "@tauri-apps/api/path"
import { invoke } from "@tauri-apps/api";

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

export async function convertPath(path: string) {
    const os = await invoke("get_os");
    if (os === "windows") {
        return path.replace("/", "\\");
    }
    return path.replace('\\', "/");
}

export async function combineConfigDir(path: string, folder: string = "WindowPet\\") {
    const configDirPath = await configDir();
    const configPathWithFolderAndFile = ''.concat(configDirPath, folder, path);
    return await convertPath(configPathWithFolderAndFile);
};

export async function getAppSettings({ path = "settings.json", key = "app" }: IGetAppSetting) {
    const configPath = await combineConfigDir(path);
    const store = new Store(configPath);
    const settings: any = await store.get(key);
    return settings;
}

export function setSettings({ path = "settings.json", key = "app", setKey, newValue }: ISetSetting) {
    (async () => {
        let setting: any = await getAppSettings({});
        setting[setKey] = newValue;
        const configPath = await combineConfigDir(path);
        const store = new Store(configPath);
        await store.set(key, setting);
        await store.save();
    })()
}