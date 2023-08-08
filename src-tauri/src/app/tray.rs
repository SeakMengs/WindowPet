use super::utils::{open_setting_window, reopen_main_window};
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

pub fn init_system_tray() -> SystemTray {
    let menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show".to_string(), "Show"))
        .add_item(CustomMenuItem::new(
            "pause".to_string(),
            "Pause (Free Memory)",
        ))
        .add_item(CustomMenuItem::new("setting".to_string(), "Setting"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("restart".to_string(), "Restart"))
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    return SystemTray::new().with_menu(menu);
}

pub fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        match id.as_str() {
            "show" => {
                match app.get_window("main") {
                    Some(_window) => {
                        println!("Window already exists");
                    }
                    None => {
                        reopen_main_window(app);
                        return;
                    }
                };
            }
            "pause" => {
                match app.get_window("main") {
                    Some(window) => {
                        window.close().expect("failed to close frontend window");
                    }
                    None => {
                        println!("Window not found");
                        return;
                    }
                };
            }
            "setting" => match app.get_window("setting") {
                Some(_window) => {
                    println!("Window setting already exists");
                }
                None => {
                    open_setting_window(app);
                    return;
                }
            },
            "restart" => {
                app.restart();
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        }
    } else if let SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
    } = event
    {
        match app.get_window("setting") {
            Some(_window) => {
                println!("Window setting already exists");
            }
            None => {
                open_setting_window(app);
                return;
            }
        }
    }
}