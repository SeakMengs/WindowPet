// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
use app::{cmd, conf, tray, utils};
use log::info;
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_log::LogTarget;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn build_app() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default()
        .targets([
            // LogTarget::LogDir,
            LogTarget::Folder(app::conf::app_root()),
            LogTarget::Stdout,
            LogTarget::Webview,
        ])
        .level(log::LevelFilter::Info)
        // uncomment to enable debug logging for development
        // .level(log::LevelFilter::Debug)
        .build())
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
            
            conf::if_app_config_does_not_exist_create_default(app, "settings.json");
            conf::if_app_config_does_not_exist_create_default(app, "pets.json");
            info!("app started");
            Ok(())
        })
        .system_tray(tray::init_system_tray())
        .on_system_tray_event(tray::handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            conf::convert_path,
            conf::combine_config_path,
            cmd::get_mouse_position,
            cmd::open_folder,
            utils::reopen_main_window,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
}

fn main() {
    // Enable gpu hardware acceleration on Windows
    //refer to this issue: https://github.com/tauri-apps/tauri/issues/4891
    std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--ignore-gpu-blocklist");

    build_app();
}
