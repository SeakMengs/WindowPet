import { IPet } from "../types/IPet";
import { ISpriteConfig } from "../types/ISpriteConfig";

export class Pet extends Phaser.Scene {
    private pet: IPet | null = null;
    private sprite: ISpriteConfig | null = null;
    private playState: string | null = null;

    readonly frameRate: number = 9;
    // -1 means repeat forever
    readonly repeat: number = -1;

    constructor() {
        super({ key: 'Pet' });
    }

    preload(): void {
        this.sprite = this.game.registry.get('spriteConfig');
        this.playState = this.game.registry.get('playState');
        this.load.spritesheet({
            key: this.sprite!.name,
            url: this.sprite!.imageSrc,
            frameConfig: this.getFrameSize(this.sprite!)
        });
    }

    create(): void {
        // register state animations
        for (const animationConfig of this.getAnimationConfigPerSprite(this.sprite!)) {
            this.anims.create(animationConfig);
        }

        this.pet = this.physics.add.sprite(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, this.sprite!.name) as IPet;

        this.pet.anims.play({
            key: `${this.playState}-${this.sprite!.name}`,
            repeat: this.repeat,
        });
        
        this.pet.body!.enable = false;
    }

    getFrameSize(sprite: ISpriteConfig): { frameWidth: number, frameHeight: number } {
        if (sprite.frameSize) {
            return {
                frameWidth: sprite.frameSize,
                frameHeight: sprite.frameSize
            };
        };

        const frameWidth = sprite.width! / sprite.highestFrameMax!;
        const frameHeight = sprite.height! / sprite.totalSpriteLine!;
        return { frameWidth, frameHeight };
    }

    getAnimationConfigPerSprite(sprite: ISpriteConfig): {
        key: string;
        frames: Phaser.Types.Animations.AnimationFrame[];
        frameRate: number;
        repeat: number;
    }[] {
        let animationConfig = [];
        for (const state in sprite.states) {
            // -1 because phaser frame start from 0
            const start = (sprite.states[state].spriteLine - 1) * this.getHighestFrameMax(sprite);
            const end = start + sprite.states[state].frameMax - 1;
            animationConfig.push({
                // avoid duplicate key
                key: `${state}-${sprite.name}`,
                frames: this.anims.generateFrameNumbers(sprite.name, {
                    start: start,
                    end: end,
                    first: start
                }),
                frameRate: this.frameRate,
                repeat: this.repeat,
            });
        }
        return animationConfig;
    }

    getHighestFrameMax(sprite: ISpriteConfig): number {
        if (sprite.highestFrameMax) return sprite.highestFrameMax;

        let highestFrameMax = 0;
        for (const state in sprite.states) {
            highestFrameMax = Math.max(highestFrameMax, sprite.states[state].frameMax);
        }

        return highestFrameMax;
    }
}