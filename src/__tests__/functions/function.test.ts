import { mockWindows, } from '@tauri-apps/api/mocks'
import { expect, it } from "vitest";


it("Should have main window", async () => {
    mockWindows("main");
    const { getCurrent } = await import('@tauri-apps/api/window');

    expect(getCurrent()).toHaveProperty('label', 'main');
})
