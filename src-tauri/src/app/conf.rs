use log::{error, info};
use serde::Deserialize;
use serde_json::json;
use std::path::{Path, PathBuf};
use tauri::App;
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
    pub fn new() -> AppConfig {
        let setting_path: String = combine_config_path("settings.json").unwrap();
        match std::fs::read_to_string(setting_path) {
            Ok(value) => {
                let json: serde_json::Value = serde_json::from_str(&value).unwrap();
                AppConfig {
                    theme: json["app"]["theme"].as_str().unwrap().to_string(),
                    language: json["app"]["language"].as_str().unwrap().to_string(),
                    allow_pet_above_taskbar: json["app"]["allowPetAboveTaskbar"].as_bool().unwrap(),
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

pub fn app_root() -> PathBuf {
    tauri::api::path::config_dir().unwrap().join("WindowPet")
}

#[tauri::command(rename_all = "snake_case")]
pub fn combine_config_path(config_name: &str) -> Option<String> {
    convert_path(app_root().join(config_name).to_str().unwrap())
}

pub fn if_app_config_does_not_exist_create_default(app: &mut App, config_name: &str) {
    let setting_path = combine_config_path(config_name).unwrap();
    if !Path::new(&setting_path).exists() {
        let default_config = match config_name {
            "settings.json" => include_str!("default/settings.json"),
            "pets.json" => include_str!("default/pets.json"),
            _ => return,
        };
        let json_data: serde_json::Value = serde_json::from_str(default_config).unwrap();
        let mut store = StoreBuilder::new(app.handle(), PathBuf::from(setting_path)).build();

        // note that values must be serd_json::Value to be compatible with JS
        store
            .insert("app".to_string(), json!(json_data))
            .unwrap_or_else(|err| {
                println!("Error inserting into store: {}", err);
            });
        store.save().unwrap();
        info!("Create default config file: {}", config_name);
    }
}
