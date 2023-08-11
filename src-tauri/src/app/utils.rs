use tauri::AppHandle;
use std::env;

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
            .inner_size(800.0, 620.0)
            .build()
            .unwrap();
    return;
}

#[tauri::command]
pub fn get_os() -> &'static str {
    return env::consts::OS;
}