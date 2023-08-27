import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { ISpriteConfig } from "../types/ISpriteConfig";
import { getAppSettings } from "../utils/settings";

export default class Pets extends Phaser.Scene {
    private pets: Phaser.Physics.Arcade.Sprite[] = [];
    private spriteConfig: ISpriteConfig[] = [];
    private isIgnoreCursorEvents: boolean = true;
    private frameCount: number = 0;

    // delay ms to set ignore cursor events
    readonly setIgnoreCursorEventsDelay: number = 50;
    readonly frameRate: number = 12;
    // -1 means repeat forever
    readonly repeat: number = -1;
    readonly forbiddenRandomState: string[] = ['fall', 'climb', 'drag', 'crawl'];
    readonly updateDelay: number = 1000 / this.frameRate;

    constructor() {
        super({ key: 'Pets' });
    }

    preload() {
        this.spriteConfig = this.game.registry.get('spriteConfig');
        let registeredName: string[] = [];
        for (let sprite of this.spriteConfig) {
            // avoid duplicate key
            if (registeredName.includes(sprite.name)) {
                let i = 0;
                do {
                    sprite.name = `${sprite.name}-${i}`;
                    i++;
                } while (registeredName.includes(sprite.name));
            }

            this.load.spritesheet({
                key: sprite.name,
                url: sprite.imageSrc,
                frameConfig: this.getFrameSize(sprite)
            });

            registeredName.push(sprite.name);
        }
    }

    create() {
        // register state animations
        for (const sprite of this.spriteConfig) {
            for (const animationConfig of this.getAnimationConfigPerSprite(sprite)) {
                this.anims.create(animationConfig);
            }
        }

        let i = 0;
        // create pets
        for (const sprite of this.spriteConfig) {
            const randomX = Phaser.Math.Between(0, window.innerWidth);
            const randomY = Phaser.Math.Between(0, window.innerHeight);
            this.pets[i] = this.physics.add.sprite(randomX, randomY, sprite.name).setInteractive({ pixelPerfect: true, draggable: true })
            this.pets[i].setCollideWorldBounds(true);
            const state = this.getOneRandomState(sprite);
            this.pets[i].play(`${state}-${sprite.name}`);
            i++;
        }

        // register event
        this.input.on('drag', (pointer: any, pet: Phaser.Physics.Arcade.Sprite, dragX: number, dragY: number) => {
            pet.x = dragX;
            pet.y = dragY;
            pet.setBounce(0, 0);
            pet.setVelocity(0);
            this.switchState(pet, 'drag');
            // if pet is dragged to the left, flip it
            pet.setFlipX(pet.x > pet.input!.dragStartX);

            // temporary stop fall 
            // @ts-ignore
            pet.body!.setAllowGravity(false);
        });

        this.input.on('dragend', (pointer: any, pet: Phaser.Physics.Arcade.Sprite) => {
            // @ts-ignore
            pet.body!.setAllowGravity(true);
            this.switchState(pet, 'fall');

        });
    }

    update(time: number, delta: number) {
        this.frameCount += delta;

        if (this.frameCount >= this.updateDelay) {
            this.frameCount = 0;
            invoke('get_mouse_position').then((event: any) => {
                for (const pet of this.pets) {
                    this.switchStateAfterPetFall(pet);
                }

                if (this.detectMouseOverPet(event.clientX, event.clientY)) {
                    this.turnOffIgnoreCursorEvents()
                } else {
                    this.turnOnIgnoreCursorEvents();
                }
            });
        }
    }

    switchState(pet: Phaser.Physics.Arcade.Sprite, state: string) {
        // if current state is the same as the new state, do nothing
        if (pet.anims.currentAnim!.key === `${state}-${pet.texture.key}`) {
            return;
        }
        pet.anims.play(`${state}-${pet.texture.key}`);
    }

    getFrameSize(sprite: any) {
        const frameWidth = sprite.width / sprite.highestFrameMax;
        const frameHeight = sprite.height / sprite.totalSpriteLine;
        return { frameWidth, frameHeight };
    }

    getAnimationConfigPerSprite(sprite: any) {
        let animationConfig = [];
        for (const state in sprite.states) {
            // -1 because phaser frame start from 0
            const frame = (sprite.states[state].spriteLine - 1) * sprite.highestFrameMax;
            const start = frame;
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

    getOneRandomState(sprite: any): string {
        const availableStates = Object.keys(sprite.states);
        let randomState;

        do {
            randomState = Phaser.Math.Between(0, availableStates.length - 1);
        } while (this.forbiddenRandomState.includes(availableStates[randomState]));

        return availableStates[randomState];
    }

    switchStateAfterPetFall(pet: Phaser.Physics.Arcade.Sprite) {
        if (pet.anims.currentAnim!.key === `fall-${pet.texture.key}`) {
            // if pet fall to the ground, switch to idle state
            // / 2 because pet anchor is 0.5
            if (pet.y >= window.innerHeight - pet.height / 2) {
                this.switchState(pet, this.getOneRandomState(this.spriteConfig.find((sprite: any) => sprite.name === pet.texture.key)));
            }
        }
    }

    turnOnIgnoreCursorEvents() {
        if (!this.isIgnoreCursorEvents) {
            // slight delay to avoid crash when call setIgnoreCursorEvents too fast
            setTimeout(() => {
                appWindow.setIgnoreCursorEvents(true).then(() => {
                    console.log("turn on ignore cursor events");
                    this.isIgnoreCursorEvents = true;
                });
            }, this.setIgnoreCursorEventsDelay);
        }
    }

    turnOffIgnoreCursorEvents() {
        if (this.isIgnoreCursorEvents) {
            console.log("turn off ignore cursor events");
            appWindow.setIgnoreCursorEvents(false).then(() => {
                this.isIgnoreCursorEvents = false;
            })
        }
    }

    detectMouseOverPet(clientX: number, clientY: number) {
        this.input.mousePointer.x = clientX;
        this.input.mousePointer.y = clientY;
        // this returns an array of all objects that the pointer is currently over,
        // if array length > 0, it means the pointer is over some sprite object
        return this.input.hitTestPointer(this.input.activePointer).length > 0
    }

}