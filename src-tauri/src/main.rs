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
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    // LogTarget::LogDir,
                    LogTarget::Folder(app::conf::app_root()),
                    LogTarget::Stdout,
                    LogTarget::Webview,
                ])
                .level(log::LevelFilter::Info)
                // uncomment to enable debug logging for development
                // .level(log::LevelFilter::Debug)
                .build(),
        )
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

            // Make window non-focusable by using platform-specific APIs
            #[cfg(target_os = "windows")]
            {
                use raw_window_handle::{HasRawWindowHandle, RawWindowHandle};

                if let RawWindowHandle::Win32(handle) = window.raw_window_handle() {
                    unsafe {
                        use windows_sys::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
                        use windows_sys::Win32::UI::WindowsAndMessaging::{
                            DefSubclassProc, GetWindowLongPtrW, RemoveWindowSubclassW,
                            SetWindowLongPtrW, SetWindowSubclassW, GWL_EXSTYLE, WNDPROC,
                            WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW,
                        };

                        let hwnd = handle.hwnd as HWND;

                        // Apply both WS_EX_NOACTIVATE and WS_EX_TOOLWINDOW for maximum non-focusable behavior
                        let current_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                        SetWindowLongPtrW(
                            hwnd,
                            GWL_EXSTYLE,
                            current_style | (WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW) as isize,
                        );

                        // Subclass the window to handle WM_MOUSEACTIVATE and prevent all activation
                        unsafe extern "system" fn window_subclass_proc(
                            hwnd: HWND,
                            msg: u32,
                            wparam: WPARAM,
                            lparam: LPARAM,
                            _subclass_id: usize,
                            _ref_data: usize,
                        ) -> LRESULT {
                            match msg {
                                0x0021 => 3, // WM_MOUSEACTIVATE -> MA_NOACTIVATE (3)
                                0x0086 => 0, // WM_NCACTIVATE -> return 0 to prevent activation
                                0x0006 => 0, // WM_ACTIVATE -> return 0 to prevent activation
                                _ => DefSubclassProc(hwnd, msg, wparam, lparam),
                            }
                        }

                        // Install the subclass procedure
                        SetWindowSubclassW(
                            hwnd,
                            Some(window_subclass_proc),
                            1, // subclass ID
                            0, // reference data
                        );
                    }
                }
            }

            #[cfg(target_os = "linux")]
            {
                // For Linux/X11, we can try to set window properties that hint it shouldn't be focusable
                // Note: Linux support for non-focusable windows varies by window manager
                // The focus: false in tauri.conf.json provides the primary implementation
                println!("Linux: Window focus disabled via configuration");
            }

            #[cfg(target_os = "macos")]
            {
                // For macOS, we'll use Objective-C to set window properties
                window
                    .with_webview(|webview| {
                        #[cfg(target_os = "macos")]
                        unsafe {
                            use objc::*;
                            let ns_window = webview.ns_window();
                            let _: () = msg_send![ns_window, setCanBecomeKeyWindow: false];
                            let _: () = msg_send![ns_window, setCanBecomeMainWindow: false];
                        }
                    })
                    .unwrap_or_else(|err| {
                        println!("Failed to set macOS window properties: {:?}", err)
                    });
            }

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
    std::env::set_var(
        "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
        "--ignore-gpu-blocklist",
    );

    build_app();
}
