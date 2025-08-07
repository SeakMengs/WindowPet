# WindowPet Migration from Tauri 1.5.4 to 2.0

## Why Upgrade?

Tauri 2.0 provides much better window control APIs that should solve the focusability issue natively:

- ✅ Enhanced `focused(false)` configuration that actually works
- ✅ Better platform-specific window management
- ✅ New `always_on_bottom()` API perfect for desktop pets
- ✅ Improved permission system for fine-grained control
- ✅ Better mobile support (future expansion)

## Migration Steps

### 1. Update Cargo.toml dependencies

```toml
[dependencies]
tauri = { version = "2", features = ["protocol-asset", "process-relaunch", "updater", "window-all", "dialog-all", "fs-all", "path-all", "macos-private-api", "system-tray", "shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
mouse_position = "0.1.3"
log = "0.4"
open = "5.0.1"
tokio = "1.35"

# Tauri 2.0 plugins (updated syntax)
tauri-plugin-autostart = "2"
tauri-plugin-store = "2"
tauri-plugin-single-instance = "2"
tauri-plugin-log = "2"

[build-dependencies]
tauri-build = { version = "2", features = [] }
```

### 2. Update tauri.conf.json structure

The config format changed significantly:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "WindowPet",
  "version": "0.0.9",
  "identifier": "com.seakmengs.windowpet",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "withGlobalTauri": true,
    "windows": [
      {
        "title": "WindowPet",
        "width": 64,
        "height": 64,
        "fullscreen": true,
        "resizable": false,
        "transparent": true,
        "alwaysOnTop": true,
        "skipTaskbar": true,
        "focused": false,
        "decorations": false,
        "shadow": false
      }
    ],
    "security": {
      "csp": null
    }
  }
}
```

### 3. Update Rust code (main.rs)

Key changes:

- `tauri::Window` → `tauri::WebviewWindow`
- `set_ignore_cursor_events()` → Similar but potentially better implementation
- Enhanced window APIs

```rust
use tauri::{Manager, WebviewWindowBuilder};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // This should work much better in Tauri 2.0
            window.set_ignore_cursor_events(true)?;

            // New APIs for better desktop pet behavior
            window.set_always_on_bottom(true)?;
            window.set_focused(false)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 4. Frontend API Updates

JavaScript API changes:

- `@tauri-apps/api` → Potentially different import structure
- Window management APIs may have changed

## Benefits After Migration

1. **Solved Focusability**: Native `focused: false` that actually works
2. **Better APIs**: `always_on_bottom()` perfect for desktop pets
3. **Enhanced Security**: New permission system
4. **Mobile Ready**: Future iOS/Android support
5. **Better Platform Integration**: Improved Windows/macOS/Linux support

## Timeline

- **Phase 1**: Update dependencies and config (1-2 hours)
- **Phase 2**: Update Rust backend code (2-3 hours)
- **Phase 3**: Test and fix frontend integration (1-2 hours)
- **Phase 4**: Test platform-specific behavior (1 hour)

**Total Estimated Time**: 5-8 hours

## Next Steps

1. Create backup branch: `git checkout -b tauri-1x-backup`
2. Start migration on new branch: `git checkout -b tauri-2x-migration`
3. Follow migration steps above
4. Test thoroughly on your target platforms
5. Merge when confirmed working

The focusability issue should be completely resolved with Tauri 2.0's native window control improvements!
