// use serde_json::json;
use serde_json::json;
use std::path::{Path, PathBuf};
use tauri::api::path;
use tauri::App;
use tauri_plugin_store::StoreBuilder;

#[tauri::command(rename_all = "snake_case")]
pub fn convert_path(path_str: &str) -> Option<String> {
    if cfg!(target_os = "windows") {
        Some(path_str.replace('/', "\\"))
    } else {
        Some(path_str.replace('\\', "/"))
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn combine_config_path(config_name: &str, folder_name: Option<String>) -> Option<String> {
    let folder_name = folder_name.unwrap_or("WindowPet\\".to_string());
    let config_dir = path::config_dir().unwrap();
    return convert_path(
        config_dir
            .join(folder_name)
            .join(config_name)
            .to_str()
            .unwrap(),
    );
}

pub fn if_app_config_does_not_exist_create_default(app: &mut App, config_name: &str) {
    let setting_config_path = combine_config_path(config_name, None).unwrap();
    if Path::new(&setting_config_path).exists() {
        return;
    }

    // because read_to_string can't read from binary file, so we use include_str! to read from project file
    let default_config = match config_name {
        "settings.json" => include_str!("default/settings.json"),
        "pets.json" => include_str!("default/pets.json"),
        _ => return,
    };
    let json_data: serde_json::Value = serde_json::from_str(default_config).unwrap();
    let mut store = StoreBuilder::new(app.handle(), PathBuf::from(setting_config_path)).build();

    // note that values must be serd_json::Value to be compatible with JS
    store
        .insert("app".to_string(), json!(json_data))
        .unwrap_or_else(|err| {
            println!("Error inserting into store: {}", err);
        });
    store.save().unwrap();
}
