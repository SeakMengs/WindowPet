import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { Store } from "tauri-plugin-store-api";
import { IGetAppSetting, ISetSetting } from "../types/ISetting";
import { configDir } from "@tauri-apps/api/path"
import { invoke } from "@tauri-apps/api";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs"

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

export async function combineConfigDir(configName: string, folder: string = "WindowPet\\") {
    const configDirPath = await configDir();
    const configPathWithFolderAndFile = ''.concat(configDirPath, folder, configName);
    return await convertPath(configPathWithFolderAndFile);
};

export async function getAppSettings({ configName = "settings.json", key = "app" }: IGetAppSetting) {
    const configPath = await combineConfigDir(configName);
    // const store = new Store(configPath);
    // const settings: any = await store.get(key);
    // return settings;
    
    // using tauri-store-plugin won't allow us to read updated config instantly
    // we have to restart the app.
    // using readTextFile instead because  it can read the updated config file.
    const data = await readTextFile(configPath);
    const json = JSON.parse(data);
    return json[key];
}

export function setSettings({ configName = "settings.json", key = "app", setKey, newValue }: ISetSetting) {
    (async () => {
        let setting: any = await getAppSettings({});
        setting[setKey] = newValue;
        const configPath = await combineConfigDir(configName);
        const store = new Store(configPath);
        await store.set(key, setting);
        await store.save();
    })()
}