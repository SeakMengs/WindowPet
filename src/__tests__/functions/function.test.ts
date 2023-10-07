import { mockIPC, mockWindows, clearMocks } from '@tauri-apps/api/mocks'
import { getAppSettings } from "../../utils/settings";
import { expect, test, afterEach } from "vitest";

afterEach(() => {
    clearMocks()
})

test("Should have main window", () => {
    mockWindows("main");

    expect(window).toHaveProperty("__TAURI_METADATA__")
})

// test("should return app settings", async () => {
//     // mock the backend function
//     mockIPC((cmd, args) => {
//         if (cmd === 'combine_config_path') {
//             return "path/to/config";
//         } 
//     })

//     const appSettings = await getAppSettings({ configName: "settings.json" });
//     expect(appSettings).toEqual({ app: { name: 'WindowPet', version: '1.0.0' } });
// });
