// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Position};
use tauri::{Size, PhysicalSize};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn change_current_app_position(app: tauri::AppHandle, x: f32, y: f32) {
    if let Some(_window) = app.get_window("main") {
        let pos = Position::Physical((x, y).into());
        _window.set_position(pos).unwrap();
    } else {
        println!("window not found");
    }
}

#[tauri::command]
fn change_current_app_size(app: tauri::AppHandle, w: u32, h: u32) {
    if let Some(_window) = app.get_window("main") {
        _window.set_size(Size::Physical(PhysicalSize { width: w, height: h })).unwrap();
    } else {
        println!("window not found");
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            change_current_app_position,
            change_current_app_size
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
