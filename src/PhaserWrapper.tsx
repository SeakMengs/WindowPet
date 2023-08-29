import { useEffect, useState } from "react";
import Phaser from "phaser";
import Pets from "./scenes/Pets";
import { ISpriteConfig } from "./types/ISpriteConfig";
import useInit from "./hooks/useInit";
import { getAppSettings } from "./utils/settings";

function PhaserWrapper() {
    const [spriteConfig, setSpriteConfig] = useState<ISpriteConfig[]>([]);

    useEffect(() => {
        (async () => {
            let config = await getAppSettings({ configName: "pets.json" });
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
                    debug: true,
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