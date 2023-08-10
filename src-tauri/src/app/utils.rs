use tauri::{AppHandle, Window};

// click through window
// credit: https://github.com/4t145/tauri-windows-clickthrough-example
pub fn allow_window_click_through(window: Window, allow_click_through_window: bool) {
    let hwnd = window.hwnd().unwrap().0;
    let _pre_val;
    let hwnd = windows::Win32::Foundation::HWND(hwnd);
    unsafe {
        use windows::Win32::UI::WindowsAndMessaging::*;
        let nindex = GWL_EXSTYLE;
        let style =
            WS_EX_APPWINDOW | WS_EX_COMPOSITED | WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST;

        if allow_click_through_window {
            _pre_val = SetWindowLongA(hwnd, nindex, style.0 as i32);
        } else {
            _pre_val = SetWindowLongA(hwnd, nindex, !style.0 as i32);
        }
    };
}

pub fn reopen_main_window(app: &AppHandle) {
    let window = tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App("/".into()))
        .fullscreen(true)
        .resizable(false)
        .transparent(true)
        .decorations(false)
        .always_on_top(true)
        .title("WindowPet")
        .skip_taskbar(true)
        .build()
        .unwrap();
    
    allow_window_click_through(window, true);
}

pub fn open_setting_window(app: &AppHandle) {
    let _window = tauri::WindowBuilder::new(
        app,
        "setting",
        tauri::WindowUrl::App("/setting".into()),
    )
    .title("WindowPet Setting")
    .inner_size(800.0, 620.0)
    .build()
    .unwrap();
    return;
}