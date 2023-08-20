use serde_json::json;
use std::env;
use std::path::{Path, PathBuf};
use tauri::api::path;
use tauri::{App, AppHandle};
use tauri_plugin_store::StoreBuilder;

pub fn reopen_main_window(app: &AppHandle) {
    let window = tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App("/".into()))
        .fullscreen(true)
        .resizable(false)
        .transparent(true)
        .always_on_top(true)
        .title("WindowPet")
        .skip_taskbar(true)
        .build()
        .unwrap();

    // allow click through window
    window
        .set_ignore_cursor_events(true)
        .unwrap_or_else(|err| println!("{:?}", err));
}

pub fn open_setting_window(app: &AppHandle) {
    let _window =
        tauri::WindowBuilder::new(app, "setting", tauri::WindowUrl::App("/setting".into()))
            .title("WindowPet Setting")
            .min_inner_size(920.0, 650.0)
            .build()
            .unwrap();
    return;
}

pub fn convert_path(path_str: &str) -> String {
    if cfg!(target_os = "windows") {
        return path_str.replace('/', "\\");
    } else {
        return path_str.replace('\\', "/");
    }
}

pub fn if_app_config_does_not_exist_create_default(app: &mut App, config_name: &str) {
    let binding = path::config_dir()
        .unwrap()
        .join("WindowPet\\".to_owned() + config_name);
    let setting_config_path = convert_path(binding.to_str().unwrap());
    let is_config_already_exist = Path::new(&setting_config_path).exists();

    if !is_config_already_exist {
        // might rewrite how we read content inside file if this function is frequently used
        let data;
        if config_name == "settings.json" {
            data = include_str!("default/settings.json");
        } else if config_name == "pets.json" {
            data = include_str!("default/pets.json");
        } else {
            return;
        }

        let json_data: serde_json::Value = serde_json::from_str(&data).unwrap();

        let mut store = StoreBuilder::new(app.handle(), PathBuf::from(setting_config_path)).build();

        // note that values must be serd_json::Value to be compatible with JS
        store
            .insert("app".to_string(), json!(json_data))
            .unwrap_or_else(|err| {
                println!("Error inserting into store: {}", err);
            });
        store.save().unwrap();
    }
}

#[tauri::command]
pub fn get_os() -> &'static str {
    return env::consts::OS;
}
