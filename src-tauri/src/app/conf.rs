use log::{error, info};
use serde::Deserialize;
use serde_json::json;
use std::path::{Path, PathBuf};
use tauri::{App, Manager};
use tauri_plugin_store::StoreBuilder;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub theme: String,
    pub language: String,
    pub allow_pet_above_taskbar: bool,
    pub allow_pet_interaction: bool,
}

impl AppConfig {
    pub fn new(app: &tauri::AppHandle) -> AppConfig {
        let setting_path = app_root(app).join("settings.json");
        let path_str = convert_path(setting_path.to_str().unwrap()).unwrap();
        match std::fs::read_to_string(path_str) {
            Ok(value) => {
                let json: serde_json::Value = serde_json::from_str(&value).unwrap();
                AppConfig {
                    theme: json["app"]["theme"].as_str().unwrap().to_string(),
                    language: json["app"]["language"].as_str().unwrap().to_string(),
                    allow_pet_above_taskbar: json["app"]["allowPetAboveTaskbar"]
                        .as_bool()
                        .unwrap(),
                    allow_pet_interaction: json["app"]["allowPetInteraction"].as_bool().unwrap(),
                }
            }
            Err(err) => {
                error!("Error reading settings.json: {}", err);
                AppConfig {
                    theme: "dark".to_string(),
                    language: "en".to_string(),
                    allow_pet_above_taskbar: false,
                    allow_pet_interaction: true,
                }
            }
        }
    }

    pub fn get_theme(&self) -> &str {
        self.theme.as_str()
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn convert_path(path_str: &str) -> Option<String> {
    if cfg!(target_os = "windows") {
        Some(path_str.replace('/', "\\"))
    } else {
        Some(path_str.replace('\\', "/"))
    }
}

pub fn app_root<R: tauri::Runtime>(app: &impl Manager<R>) -> PathBuf {
    app.path().config_dir().unwrap().join("WindowPet")
}

#[tauri::command(rename_all = "snake_case")]
pub fn combine_config_path(app: tauri::AppHandle, config_name: &str) -> Option<String> {
    convert_path(app_root(&app).join(config_name).to_str().unwrap())
}

pub fn if_app_config_does_not_exist_create_default<R: tauri::Runtime>(
    app: &mut App<R>,
    config_name: &str,
) {
    let setting_path = app_root(app).join(config_name);
    if !Path::new(&setting_path).exists() {
        let default_config = match config_name {
            "settings.json" => include_str!("default/settings.json"),
            "pets.json" => include_str!("default/pets.json"),
            _ => return,
        };
        let json_data: serde_json::Value = serde_json::from_str(default_config).unwrap();
        let store = StoreBuilder::new(app.handle(), setting_path)
            .build()
            .unwrap();

        store.set("app", json!(json_data));
        store.save().unwrap();
        info!("Create default config file: {}", config_name);
    }
}
