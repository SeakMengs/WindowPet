import { useEffect, useState } from "react";
import Phaser from "phaser";
import Pets from "./scenes/Pets";
import { ISpriteConfig } from "./types/ISpriteConfig";
import { getAppSettings } from "./utils/settings";
import { confirm } from "@tauri-apps/api/dialog";
import { appWindow } from "@tauri-apps/api/window";

function PhaserWrapper() {
    const [spriteConfig, setSpriteConfig] = useState<ISpriteConfig[]>([]);

    useEffect(() => {
        (async () => {
            let config = await getAppSettings({ configName: "pets.json" });
            if (config.length === 0) {
                confirm("Nya~ Oh, dear friend! In this whimsical realm of mine, where magic and wonder intertwine, alas, there are no delightful pets to be found. But fret not! Fear not! For you hold the power to change this tale. Simply venture into the enchanting settings and add a touch of furry companionship to make our world even more adorable and divine! Onegai~", { title: "WindowPet Dialog", type: 'info' }).then((ok) => {
                    appWindow.close();
                });
            }
            setSpriteConfig(config);
        })()
    }, []);

    useEffect(() => {
        const phaserConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "phaser-container",
            // white alpha 0
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
                target: 60,
                min: 20,
                smoothStep: true,
            },
            scene: [Pets],
            callbacks: {
                preBoot: (game) => {
                    game.registry.set('spriteConfig', spriteConfig);
                }
            }
        }

        const game = new Phaser.Game(phaserConfig);

        return () => {
            game.destroy(true);
        }

    }, [spriteConfig]);

    return (
        <>
        </>
    )
}

export default PhaserWrapper;