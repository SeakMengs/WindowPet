// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;

use app::cmd::{change_current_app_position, change_current_app_size};

fn main() {
    // click through window
    // credit: https://github.com/4t145/tauri-windows-clickthrough-example
    tauri::Builder::default()
        .setup(move |app| {
            use tauri::Manager;
            let window = app.get_window("main").unwrap();
            let hwnd = window.hwnd().unwrap().0;
            let _pre_val;
            let hwnd = windows::Win32::Foundation::HWND(hwnd);
            unsafe {
                use windows::Win32::UI::WindowsAndMessaging::*;
                let nindex = GWL_EXSTYLE;
                let style = WS_EX_APPWINDOW
                    | WS_EX_COMPOSITED
                    | WS_EX_LAYERED
                    | WS_EX_TRANSPARENT
                    | WS_EX_TOPMOST;
                _pre_val = SetWindowLongA(hwnd, nindex, style.0 as i32);
                //   if we want to remove the click through, we can use this
                //   _pre_val = SetWindowLongA(hwnd, nindex, !style.0 as i32);
            };
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            change_current_app_position,
            change_current_app_size
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
