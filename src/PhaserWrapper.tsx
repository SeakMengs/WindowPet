import { useEffect } from "react";
import Phaser from "phaser";
import Pets from "./scenes/Pets";
import { useSettingStore } from "./hooks/useSettingStore";
import { appWindow } from "@tauri-apps/api/window";

function PhaserWrapper() {
    const { pets } = useSettingStore();

    useEffect(() => {
        // ensure that if component remount user will still be able to touch their screen
        appWindow.setIgnoreCursorEvents(true);

        const phaserConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "phaser-container",
            backgroundColor: '#ffffff0',
            transparent: true,
            scale: {
                mode: Phaser.Scale.ScaleModes.RESIZE,
                width: window.innerWidth,
                height: window.innerHeight,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 200 },
                },
            },
            fps: {
                target: 144,
                min: 30,
                smoothStep: true,
            },
            scene: [Pets],
            callbacks: {
                preBoot: (game) => {
                    game.registry.set('spriteConfig', pets);
                }
            }
        }

        const game = new Phaser.Game(phaserConfig);

        return () => {
            game.destroy(true);
        }

    }, [pets]);

    return (
        <>
        </>
    )
}

export default PhaserWrapper;