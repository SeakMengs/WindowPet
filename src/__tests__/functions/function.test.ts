import { mockWindows, } from '@tauri-apps/api/mocks'
import { expect, it } from "vitest";


it("Should have main window", async () => {
    mockWindows("main");
    const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');

    expect(getCurrentWebviewWindow()).toHaveProperty('label', 'main');
})
