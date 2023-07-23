use tauri::{Manager, Position};
use tauri::{Size, PhysicalSize};

#[tauri::command]
pub fn change_current_app_position(app: tauri::AppHandle, x: f32, y: f32) {
    if let Some(_window) = app.get_window("main") {
        let pos = Position::Physical((x, y).into());
        _window.set_position(pos).unwrap();
    } else {
        println!("window not found");
    }
}

#[tauri::command]
pub fn change_current_app_size(app: tauri::AppHandle, w: u32, h: u32) {
    if let Some(_window) = app.get_window("main") {
        _window.set_size(Size::Physical(PhysicalSize { width: w, height: h })).unwrap();
    } else {
        println!("window not found");
    }
}