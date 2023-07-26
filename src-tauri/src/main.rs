// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;

use app::cmd::{change_current_app_position, change_current_app_size};
use app::tray::{handle_tray_event, init_system_tray};
use app::utils::allow_window_click_through;

fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            use tauri::Manager;
            let window = app.get_window("main").unwrap();
            allow_window_click_through(window, true);
            Ok(())
        })
        .system_tray(init_system_tray())
        .on_system_tray_event(handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            change_current_app_position,
            change_current_app_size
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
