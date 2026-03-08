// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
use app::{cmd, conf, tray, utils};
use log::info;
use tauri::{Emitter, Manager};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_log::{Target, TargetKind};

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn build_app() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--flag1", "--flag2"]),
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::Webview),
                ])
                .level(log::LevelFilter::Info)
                // uncomment to enable debug logging for development
                // .level(log::LevelFilter::Debug)
                .build(),
        )
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(move |app| {
            let window = app.get_webview_window("main").unwrap();
            window
                .set_ignore_cursor_events(true)
                .unwrap_or_else(|err| println!("{:?}", err));

            conf::if_app_config_does_not_exist_create_default(app, "settings.json");
            conf::if_app_config_does_not_exist_create_default(app, "pets.json");

            tray::create_tray(app)?;

            info!("app started");
            Ok(())
        })
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
    // See: https://github.com/tauri-apps/tauri/issues/4891
    std::env::set_var(
        "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
        "--ignore-gpu-blocklist",
    );

    build_app();
}
