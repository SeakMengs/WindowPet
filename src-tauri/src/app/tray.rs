use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

pub fn init_system_tray() -> SystemTray {
    let menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show".to_string(), "Show"))
        .add_item(CustomMenuItem::new(
            "pause".to_string(),
            "Pause (Free Memory)",
        ))
        .add_item(CustomMenuItem::new("restart".to_string(), "Restart"))
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    return SystemTray::new().with_menu(menu);
}

pub fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        let window = app.get_window("main").unwrap();

        match id.as_str() {
            "show" => {
                if !window.is_visible().unwrap() {
                    window.show().expect("failed to show window");
                }
            }
            "pause" => {
                if window.is_visible().unwrap() {
                    window.hide().expect("failed to hide window");
                }
            }
            "restart" => {
                app.restart();
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        }
    }
}
