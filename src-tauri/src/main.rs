// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
use app::cmd::{get_mouse_position, open_folder};
use app::conf::{combine_config_path, convert_path, if_app_config_does_not_exist_create_default};
use app::tray::{handle_tray_event, init_system_tray};
use log::info;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_log::LogTarget;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default().targets([
            // LogTarget::LogDir,
            LogTarget::Folder(app::conf::app_root()),
            LogTarget::Stdout,
            LogTarget::Webview,
        ]).build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .setup(move |app| {
            let window = app.get_window("main").unwrap();
            window
                .set_ignore_cursor_events(true)
                .unwrap_or_else(|err| println!("{:?}", err));
            
            if_app_config_does_not_exist_create_default(app, "settings.json");
            if_app_config_does_not_exist_create_default(app, "pets.json");
            info!("app started");
            Ok(())
        })
        .system_tray(init_system_tray())
        .on_system_tray_event(handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            convert_path,
            combine_config_path,
            get_mouse_position,
            open_folder,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
}
