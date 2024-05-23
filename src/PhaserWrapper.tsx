import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import Pets from "./scenes/Pets";
import { useSettingStore } from "./hooks/useSettingStore";
import { appWindow } from "@tauri-apps/api/window";

function PhaserWrapper() {
    const phaserDom = useRef<HTMLDivElement>(null);
    const { pets } = useSettingStore();

    const [screenWidth, setScreenWidth] = useState(window.screen.width);
    const [screenHeight, setScreenHeight] = useState(window.screen.height);

    useEffect(() => {
        if (!phaserDom.current) return;

        const handleResize = () => {
            setScreenWidth(window.screen.width);
            setScreenHeight(window.screen.height);
        };

        window.addEventListener("resize", handleResize);

        // ensure that if component remount user will still be able to touch their screen
        appWindow.setIgnoreCursorEvents(true);

        const phaserConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: phaserDom.current,
            backgroundColor: '#ffffff0',
            transparent: true,
            roundPixels: true,
            antialias: true,
            scale: {
                mode: Phaser.Scale.ScaleModes.RESIZE,
                width: screenWidth,
                height: screenHeight,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 200, x: 0},
                },
            },
            fps: {
                target: 30,
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
                    // game.registry.set('defaultPets', defaultPets);
                }
            }
        }

        const game = new Phaser.Game(phaserConfig);

        return () => {
            game.destroy(true);
            // reset the dom
            if (phaserDom.current !== null) phaserDom.current.innerHTML = '';
            window.removeEventListener("resize", handleResize);
        }

    }, [pets, screenWidth, screenHeight]);

    return (
        <>
            <div ref={phaserDom} />
        </>
    )
}

export default PhaserWrapper;