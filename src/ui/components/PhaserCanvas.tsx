import Phaser from "phaser";
import { memo, useEffect, useRef, useState } from "react";
import { Pet } from "../../scenes/Pet";
import { CanvasSize } from "../../utils";
import { PhaserCanvasProps } from "../../types/components/type";

function PhaserCanvas({ pet, playState }: PhaserCanvasProps) {
    const phaserDom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (phaserDom.current === null) return;
        const phaserConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.CANVAS,
            parent: phaserDom.current,
            transparent: true,
            roundPixels: true,
            antialias: true,
            scale: {
                // mode: Phaser.Scale.ScaleModes.RESIZE,
                width: CanvasSize,
                height: CanvasSize,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 200, x: 0 },
                },
            },
            fps: {
                target: 30,
                min: 30,
                smoothStep: true,
            },
            scene: [Pet],
            audio: {
                noAudio: true,
            },
            callbacks: {
                preBoot: (game) => {
                    game.registry.set('spriteConfig', pet);
                    game.registry.set('playState', playState);
                }
            }
        }

        const game = new Phaser.Game(phaserConfig);

        return () => {
            game.destroy(true);
            // reset the dom
            if (phaserDom.current !== null) phaserDom.current.innerHTML = '';
        }
    }, [pet, playState]);

    return (
        <div style={{
            // disable pointer events so that the canvas can be scrolled when the mouse is over it
            pointerEvents: 'none',
        }} ref={phaserDom} key={pet.id ?? pet.name}></div>
    )
}

export default memo(PhaserCanvas);