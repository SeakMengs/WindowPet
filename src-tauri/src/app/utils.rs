use serde_json::json;
use std::path::{Path, PathBuf};
use std::env;
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
}

pub fn convert_path(path_str: &str) -> Option<String> {
    if cfg!(target_os = "windows") {
        return Some(path_str.replace('/', "\\"));
    }

    return Some(path_str.replace('\\', "/"));
}

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
    let is_config_already_exist = Path::new(&setting_config_path).exists();

    if is_config_already_exist {
        return;
    }

    // because read_to_string can't read from binary file, so we use include_str! to read from project file
    let data = match config_name {
        "settings.json" => include_str!("default/settings.json"),
        "pets.json" => include_str!("default/pets.json"),
        _ => return,
    };
    let json_data: serde_json::Value = serde_json::from_str(data).unwrap();
    let mut store = StoreBuilder::new(app.handle(), PathBuf::from(setting_config_path)).build();

    // note that values must be serd_json::Value to be compatible with JS
    store
        .insert("app".to_string(), json!(json_data))
        .unwrap_or_else(|err| {
            println!("Error inserting into store: {}", err);
        });
    store.save().unwrap();
}

#[tauri::command]
pub fn get_os() -> &'static str {
    return env::consts::OS;
}
