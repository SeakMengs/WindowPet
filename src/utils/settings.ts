import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";
import { Store } from "tauri-plugin-store-api";
import { IGetAppSetting, ISetSetting } from "../types/ISetting";
import { invoke } from '@tauri-apps/api/tauri'
import { readTextFile, exists } from "@tauri-apps/api/fs"
import { confirm } from "@tauri-apps/api/dialog";

export function toggleAutoStartUp(isAutoStartUp: boolean) {
    (async () => {
        const hasEnabledStartUp = await isEnabled();

        if (isAutoStartUp) {
            if (!hasEnabledStartUp) await enable();
        } else if (hasEnabledStartUp) {
            await disable();
        }
    })()
};

// default will return app settings, if key is provided, will return specific key
export async function getAppSettings({ configName = "settings.json", key = "app" }: IGetAppSetting) {
    const configPath: string = await invoke("combine_config_path", { config_name: configName });
    const configExists = await exists(configPath);

    if (!configExists) {
        await confirm(`Could not get data from ${configPath}`, { title: "WindowPet Dialog", type: 'error' });
        return;
    }

    const data = await readTextFile(configPath);
    const json = JSON.parse(data);
    return json[key];
}

export function setSettings({ configName = "settings.json", key = "app", setKey, newValue }: ISetSetting) {
    (async () => {
        let setting: any = await getAppSettings({ configName });
        setting[setKey] = newValue;
        const configPath: string = await invoke("combine_config_path", { config_name: configName });
        // if not exist, create new file, so we don't need to check if file exists
        const store = new Store(configPath);
        await store.set(key, setting);
        await store.save();
    })()
}