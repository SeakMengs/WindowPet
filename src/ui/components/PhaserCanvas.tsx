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
            scale: {
                // mode: Phaser.Scale.ScaleModes.RESIZE,
                width: CanvasSize,
                height: CanvasSize,
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
            scene: [Pet],
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
        }
    }, [pet, playState]);

    return (
        <div ref={phaserDom}></div>
    )
}

export default memo(PhaserCanvas);