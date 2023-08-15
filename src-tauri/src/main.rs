// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
use app::cmd::{change_current_app_position, change_current_app_size};
use app::tray::{handle_tray_event, init_system_tray};
use app::utils::{get_os, if_app_config_does_not_exist_create_default};
use tauri_plugin_autostart::MacosLauncher;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(move |app| {
            use tauri::Manager;
            let window = app.get_window("main").unwrap();
            window
                .set_ignore_cursor_events(true)
                .unwrap_or_else(|err| println!("{:?}", err));

            if_app_config_does_not_exist_create_default(app, "settings.json");
            if_app_config_does_not_exist_create_default(app, "pets.json");

            Ok(())
        })
        .system_tray(init_system_tray())
        .on_system_tray_event(handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            change_current_app_position,
            change_current_app_size,
            get_os,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}
