import { useEffect, useRef } from "react";
import Phaser from "phaser";
import Pets from "./scenes/Pets";
import { useSettingStore } from "./hooks/useSettingStore";
import { appWindow } from "@tauri-apps/api/window";
import defaultPetConfig from "./config/pet_config.json";


function PhaserWrapper() {
    const phaserDom = useRef<HTMLDivElement>(null);
    const { pets } = useSettingStore();
    const defaultPets = JSON.parse(JSON.stringify(defaultPetConfig));

    useEffect(() => {
        if (!phaserDom.current) return;

        // ensure that if component remount user will still be able to touch their screen
        appWindow.setIgnoreCursorEvents(true);

        const phaserConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: phaserDom.current,
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
            audio: {
                noAudio: true,
            },
            callbacks: {
                preBoot: (game) => {
                    game.registry.set('spriteConfig', pets);
                    game.registry.set('defaultPets', defaultPets);
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
            <div ref={phaserDom} />
        </>
    )
}

export default PhaserWrapper;