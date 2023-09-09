use super::utils::{open_setting_window, reopen_main_window};
use log::info;
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

    SystemTray::new().with_menu(menu)
}

pub fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        match id.as_str() {
            "show" => {
                match app.get_window("main") {
                    Some(window) => {
                        println!("Window already exists");
                        tauri::api::dialog::message(Some(&window), "WindowPet Dialog", "Pet already exist");
                    }
                    None => {
                        reopen_main_window(app);
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
                    }
                };
            }
            "setting" => match app.get_window("setting") {
                Some(window) => {
                    tauri::api::dialog::message(Some(&window), "WindowPet Dialog", "WindowPet setting already exist");
                    println!("Window setting already exist");
                }
                None => {
                    open_setting_window(app);
                }
            },
            "restart" => {
                info!("Restart WindowPet");
                app.restart();
            }
            "quit" => {
                info!("Quit WindowPet");
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
            Some(window) => {
                tauri::api::dialog::message(Some(&window), "WindowPet Dialog", "WindowPet setting already exist");
                println!("Window setting already exists");
            }
            None => {
                open_setting_window(app);
            }
        }
    }
}
