use super::conf::AppConfig;
use log::info;
use tauri::{AppHandle, Theme};

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
    info!("reopen main window");
}

pub fn open_setting_window(app: &AppHandle) {
    let settings = AppConfig::new();
    let _window =
        tauri::WindowBuilder::new(app, "setting", tauri::WindowUrl::App("/setting".into()))
            .title("WindowPet Setting")
            .inner_size(1000.0, 650.0)
            // .min_inner_size(1280.0, 650.0)
            .theme(if settings.get_theme() == "dark" {
                Some(Theme::Dark)
            } else {
                Some(Theme::Light)
            })
            .build()
            .unwrap();
    info!("open setting window");
}
