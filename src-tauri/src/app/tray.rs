use super::utils::{open_setting_window, reopen_main_window};
use log::info;
use tauri::{
    image::Image,
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager,
};
use tauri_plugin_dialog::DialogExt;

pub fn create_tray(app: &tauri::App<tauri::Wry>) -> tauri::Result<()> {
    let show = MenuItemBuilder::new("Show").id("show").build(app)?;
    let pause = MenuItemBuilder::new("Pause (Free Memory)").id("pause").build(app)?;
    let setting = MenuItemBuilder::new("Setting").id("setting").build(app)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let restart = MenuItemBuilder::new("Restart").id("restart").build(app)?;
    let quit = MenuItemBuilder::new("Quit").id("quit").build(app)?;

    let menu = MenuBuilder::new(app)
        .items(&[&show, &pause, &setting, &separator, &restart, &quit])
        .build()?;

    let _tray = TrayIconBuilder::new()
        .icon(Image::from_bytes(include_bytes!("../../icons/32x32.png"))?)
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                match app.get_webview_window("main") {
                    Some(_window) => {
                        println!("Window already exists");
                        app.dialog()
                            .message("Pet already exist")
                            .title("WindowPet Dialog")
                            .show(|_| {});
                    }
                    None => {
                        let app_clone = app.clone();
                        tauri::async_runtime::spawn(async move {
                            reopen_main_window(app_clone).await.unwrap_or_else(|e| {
                                println!("Error reopening main window: {}", e);
                            });
                        });
                    }
                };
            }
            "pause" => {
                match app.get_webview_window("main") {
                    Some(window) => {
                        window.close().expect("failed to close frontend window");
                    }
                    None => {
                        println!("Window not found");
                    }
                };
            }
            "setting" => match app.get_webview_window("setting") {
                Some(_window) => {
                    app.dialog()
                        .message("WindowPet setting already exist")
                        .title("WindowPet Dialog")
                        .show(|_| {});
                    println!("Window setting already exist");
                }
                None => {
                    open_setting_window(app.clone());
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
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::DoubleClick {
                button: MouseButton::Left,
                ..
            } = event
            {
                let app = tray.app_handle();
                match app.get_webview_window("setting") {
                    Some(_window) => {
                        app.dialog()
                            .message("WindowPet setting already exist")
                            .title("WindowPet Dialog")
                            .show(|_| {});
                        println!("Window setting already exists");
                    }
                    None => {
                        open_setting_window(app.clone());
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}
