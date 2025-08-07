mod app;
use app::conf;
use log::info;
use tauri::{Emitter, Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .setup(move |app| {
            // In Tauri 2.0, use get_webview_window instead of get_window
            let window = app.get_webview_window("main").unwrap();

            // Set cursor events to be ignored for desktop pet behavior
            window
                .set_ignore_cursor_events(true)
                .unwrap_or_else(|err| println!("Failed to set ignore cursor events: {:?}", err));

            // Tauri 2.0 should handle the focused: false config properly
            // The set_focus() method in Tauri 2.0 doesn't take arguments
            // It focuses the window, so we don't need to call it for non-focusable behavior

            conf::if_app_config_does_not_exist_create_default(app, "settings.json");
            conf::if_app_config_does_not_exist_create_default(app, "pets.json");
            info!("app started");
            Ok(())
        })
        // TODO: Update tray implementation for Tauri 2.0
        // System tray temporarily disabled for migration
        // Will be re-enabled after migrating tray module to Tauri 2.0
        .invoke_handler(tauri::generate_handler![
            greet,
            // TODO: Re-enable these handlers after migrating the app modules
            // cmd::get_mouse_position,
            // cmd::open_folder,
            // utils::reopen_main_window,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
}
