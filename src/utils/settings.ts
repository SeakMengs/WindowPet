import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import { Store } from "@tauri-apps/plugin-store";
import { DefaultConfigName, IGetAppSetting } from "../types/ISetting";
import { invoke } from '@tauri-apps/api/core'
import { readTextFile, exists, copyFile, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs"
import { appLocalDataDir } from "@tauri-apps/api/path"
import { confirm } from "@tauri-apps/plugin-dialog";
import { IPetObject } from "../types/ISpriteConfig";
import { showNotification } from "./notification";
import i18next from "i18next";
import { error, info } from "@tauri-apps/plugin-log";

export function toggleAutoStartUp(allowAutoStartUp: boolean) {
    (async () => {
        const hasEnabledStartUp = await isEnabled();

        if (allowAutoStartUp) {
            if (!hasEnabledStartUp) await enable();
        } else if (hasEnabledStartUp) {
            await disable();
        }
    })()
};

// Ensure the WindowPet directory exists in app data
async function ensureAppDataDir() {
    const appDataDir = await appLocalDataDir();
    const windowPetDir = `${appDataDir}/WindowPet`;
    
    // Create the directory if it doesn't exist
    if (!(await exists(windowPetDir))) {
        await mkdir(windowPetDir);
    }
    
    return windowPetDir;
}

// default will return app settings, if key is provided, will return specific key
export async function getAppSettings({ configName = "settings.json", key = "app", withErrorDialog = true }: IGetAppSetting) {
    try {
        // Ensure the app data directory exists
        const windowPetDir = await ensureAppDataDir();
        const configPath = `${windowPetDir}/${configName}`;
        
        const configExists = await exists(configPath);

        if (!configExists) {
            if (withErrorDialog) await confirm(`Could not get data from ${configPath}`, { title: "WindowPet Dialog" });
            return;
        }

        const data = await readTextFile(configPath);
        const json = JSON.parse(data);
        return json[key];
    } catch (error) {
        console.error("getAppSettings: Error occurred:", error);
        throw error;
    }
}

// set a specific key under object app
// exp: { app: { key: value } }
interface ISetSetting extends IGetAppSetting {
    setKey: string,
    newValue: unknown,
}
export function setSettings({ configName = "settings.json", key = "app", setKey, newValue }: ISetSetting) {
    (async () => {
        let setting: any = await getAppSettings({ configName });
        setting[setKey] = newValue;
        
        // Ensure the app data directory exists
        const windowPetDir = await ensureAppDataDir();
        const configPath = `${windowPetDir}/${configName}`;
        
        // if not exist, create new file, so we don't need to check if file exists
        const store = await Store.load(configPath);
        await store.set(key, setting);
        await store.save();
    })()
}

// this function differs from setSettings because it will replace the whole config file, not just some specific key
export interface ISetConfig extends IGetAppSetting {
    newConfig: unknown,
}
export function setConfig({ configName = "settings.json", key = "app", newConfig }: ISetConfig) {
    (async () => {
        // Ensure the app data directory exists
        const windowPetDir = await ensureAppDataDir();
        const configPath = `${windowPetDir}/${configName}`;
        
        // if not exist, create new file, so we don't need to check if file exists
        const store = await Store.load(configPath);
        await store.set(key, newConfig);
        await store.save();
    })()
}

export async function getNoneExistingConfigFileName({ configName, extension, folderName }: { configName: string, extension: string, folderName?: string }) {
    // if file name doesn't exist, return the same name
    // else generate a new name with -1, -2, -3, etc
    
    // Ensure the app data directory exists
    const windowPetDir = await ensureAppDataDir();
    const configPath = `${windowPetDir}/${folderName}${configName}${extension}`;
    const configExists = await exists(configPath);
    if (!configExists) return configName;

    let i = 1;

    while (configExists) {
        const newConfigName = `${configName}-${i}`;
        const newConfigPath = `${windowPetDir}/${folderName}${newConfigName}${extension}`;
        const newConfigExists = await exists(newConfigPath);
        if (!newConfigExists) return newConfigName;
        i++;
    }
}

async function updateCustomPetConfig(newCustomPetPath: string) {
    // Ensure the app data directory exists
    const windowPetDir = await ensureAppDataDir();
    const customPetConfigPath = `${windowPetDir}/${DefaultConfigName.PET_LINKER}`;
    if (await exists(customPetConfigPath)) {

        const customPetConfig = await getAppSettings({ configName: DefaultConfigName.PET_LINKER });

        if (customPetConfig) {
            customPetConfig.push(newCustomPetPath);
            setConfig({ configName: DefaultConfigName.PET_LINKER, newConfig: customPetConfig });
            return;
        }
    }

    setConfig({ configName: DefaultConfigName.PET_LINKER, newConfig: [newCustomPetPath] });
}

export async function saveCustomPet(petObject: IPetObject) {
    try {
        info(`Start saving custom pet, pet name: ${petObject.name}`);
        petObject.customId = crypto.randomUUID();
        const uniquePetFileName = await getNoneExistingConfigFileName({
            configName: petObject.name as string,
            folderName: "custom-pets/",
            extension: ".json"
        });
        const userImageSrc = petObject.imageSrc as string;
        petObject.imageSrc = await invoke("combine_config_path", { config_name: `assets/${uniquePetFileName}.png` }) as string;

        // create dir if not exist and copy file to assets folder
        await mkdir('assets', { baseDir: BaseDirectory.AppConfig, recursive: true });
        await copyFile(userImageSrc, petObject.imageSrc);

        setConfig({ configName: `custom-pets/${uniquePetFileName}.json`, newConfig: petObject });

        // this config is the one that will be used to load custom pets (act as a list of custom pets)
        await updateCustomPetConfig(await invoke("combine_config_path", { config_name: `custom-pets/${uniquePetFileName}.json` }));

        showNotification({
            title: i18next.t("Custom Pet Added"),
            message: i18next.t(`pet name has been added to your custom pet list, restart WindowPet and check pet shop to spawn your custom pet`, { name: petObject.name }),
        });
        info(`Successfully save custom pet, pet name: ${petObject.name}`);
    } catch (err) {
        error(`Error at saveCustomPet: ${err}`);
        showNotification({
            title: i18next.t("Error Adding Custom Pet"),
            message: err as any,
            isError: true,
        });
    }
}