import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { ISpriteConfig } from "../types/ISpriteConfig";
import { useSettingStore } from "../hooks/useSettingStore";
import { listen } from "@tauri-apps/api/event";
import { TRenderEventListener } from "../types/IEvents";
import { IPet, Direction } from "../types/IPet";

export default class Pets extends Phaser.Scene {
    private pets: IPet[] = [];
    private spriteConfig: ISpriteConfig[] = [];
    private isIgnoreCursorEvents: boolean = true;
    private isFlipped: boolean = false;
    private frameCount: number = 0;
    private allowPetInteraction: boolean = useSettingStore.getState().allowPetInteraction

    // delay ms to set ignore cursor events
    readonly setIgnoreCursorEventsDelay: number = 50;
    readonly frameRate: number = 15;
    // -1 means repeat forever
    readonly repeat: number = -1;
    readonly forbiddenRandomState: string[] = ['fall', 'climb', 'drag', 'crawl'];
    readonly movementState: string[] = ['walk', 'fall', 'climb', 'crawl', 'drag'];
    readonly updateDelay: number = 1000 / this.frameRate;
    readonly moveVelocity: number = 30;

    constructor() {
        super({ key: 'Pets' });
    }

    preload(): void {
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

    create(): void {
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
            this.pets[i] = this.physics.add.sprite(randomX, randomY, sprite.name).setInteractive({
                draggable: true,
                pixelPerfect: true,
            });

            // set pet to bounce on left and right of the world
            this.pets[i].setCollideWorldBounds(true);
            this.pets[i].setBounce(1, 0);

            if (Object.keys(sprite.states).includes('fall')) {
                this.switchState(this.pets[i], 'fall');
            } else {
                // play random state
                this.switchState(this.pets[i], this.getOneRandomState(sprite));
                // set pet vertical position to 0 because the pet doesn't have fall state
                this.pets[i].setPosition(this.pets[i].x, 0);
            }

            i++;
        }

        // register event
        this.input.on('drag', (pointer: any, pet: IPet, dragX: number, dragY: number) => {
            pet.x = dragX;
            pet.y = dragY;
            this.switchState(pet, 'drag');

            // if current pet x is greater than drag start x, flip the pet to the right
            if (pet.x > pet.input!.dragStartX) {
                if (this.isFlipped) {
                    this.toggleFlipX(pet);
                    this.isFlipped = false;
                }
            } else {
                if (!this.isFlipped) {
                    this.toggleFlipX(pet);
                    this.isFlipped = true;
                }
            }

            // temporary stop fall 
            // @ts-ignore
            pet.body.setAllowGravity(false);
        });

        this.input.on('dragend', (pointer: any, pet: IPet) => {
            // @ts-ignore
            pet.body!.setAllowGravity(true);
            this.switchState(pet, 'fall');
        });

        // listen to setting change from setting window and update settings
        listen<any>('render', (event: TRenderEventListener) => {
            switch (event.payload.dispatchType) {
                case 'switchAllowPetInteraction':
                    this.allowPetInteraction = event.payload!.value as boolean;
                    break;
                default:
                    break;
            }
        })
    }

    update(time: number, delta: number): void {
        this.frameCount += delta;

        if (this.frameCount >= this.updateDelay) {
            this.frameCount = 0;
            for (let pet of this.pets) {
                this.switchStateAfterPetFall(pet);
            }

            if (this.allowPetInteraction) {
                invoke('get_mouse_position').then((event: any) => {
                    if (this.detectMouseOverPet(event.clientX, event.clientY)) {
                        // console.log('mouse over pet');
                        this.turnOffIgnoreCursorEvents()
                    } else {
                        // console.log('mouse not over pet');
                        this.turnOnIgnoreCursorEvents();
                    }
                });
            }
        }
    }

    updateDirection(pet: IPet, direction: Direction): void {
        pet.direction = direction;
        this.updateMovement(pet);
    }

    updateStateDirection(pet: IPet, state: string): void {
        let direction: Direction | undefined;

        switch (state) {
            case 'walk':
                direction = pet.scaleX === -1 ? Direction.LEFT : Direction.RIGHT;
                break;
            case 'drag':
                direction = Direction.UNKNOWN;
                break;
            case 'fall':
                // feel like fall state is opposite of walk so every fall, i flip the pet horizontally :)
                this.toggleFlipX(pet);
                direction = Direction.DOWN;
                break;
            case 'climb':
                direction = Direction.UP;
                break;
            case 'crawl':
                direction = pet.scaleX === -1 ? Direction.LEFT : Direction.RIGHT;
            default:
                break;
        }

        if (direction) {
            this.updateDirection(pet, direction);
        }
    };

    // this function will be called every time we update the pet direction using updateDirection
    updateMovement(pet: IPet): void {
        switch (pet.direction) {
            case Direction.RIGHT:
                pet.setVelocityX(this.moveVelocity);
                break;
            case Direction.LEFT:
                pet.setVelocityX(-this.moveVelocity);
                break;
            case Direction.UP:
                pet.setVelocityY(-this.moveVelocity);
                break;
            case Direction.DOWN:
                pet.setVelocityY(this.moveVelocity / 2);
                break;
            case Direction.UNKNOWN:
                pet.setVelocity(0);
                break;
            default:
                pet.setVelocityX(0);
                break;
        }
    }

    switchState(pet: IPet, state: string): void {
        // if current state is the same as the new state, do nothing
        if (pet.anims.getName() === `${state}-${pet.texture.key}`) {
            return;
        }

        pet.anims.play(`${state}-${pet.texture.key}`);

        if (this.movementState.includes(state.toLowerCase())) {
            this.updateStateDirection(pet, state);
        } else {
            this.updateDirection(pet, Direction.UNKNOWN);
        }
    }

    toggleFlipX(pet: IPet): void {
        /*
         * using scale because flipX doesn't flip the hitbox
         * so i have to flip the hitbox manually
         * Note: scaleX -1 = direction left, scaleX 1 = direction right
         */
        if (pet.scaleX === 1) {
            // if hitbox is on the right, flip to the left
            pet.setOffset(pet.width, 0);
        } else {
            pet.setOffset(0, 0);
        }

        pet.setScale(pet.scaleX * -1, pet.scaleY);
    }

    toggleFlipXThenUpdateDirection(pet: IPet): void {
        pet.toggleFlipX();
        this.updateDirection(pet, pet.scaleX === -1 ? Direction.LEFT : Direction.RIGHT);
    }

    getFrameSize(sprite: ISpriteConfig): { frameWidth: number, frameHeight: number } {
        const frameWidth = sprite.width / sprite.highestFrameMax;
        const frameHeight = sprite.height / sprite.totalSpriteLine;
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

    getOneRandomState(sprite: ISpriteConfig): string {
        const availableStates = Object.keys(sprite.states);
        let randomState;

        do {
            randomState = Phaser.Math.Between(0, availableStates.length - 1);
        } while (this.forbiddenRandomState.includes(availableStates[randomState]));

        return availableStates[randomState];
    }

    switchStateAfterPetFall(pet: IPet): void {
        if (pet.anims.getName() === `fall-${pet.texture.key}`) {
            // if pet fall to the ground, switch to idle state
            if (this.isPetOnTheGround(pet)) {
                const randomState = this.getOneRandomState(this.spriteConfig.find(
                    (sprite: ISpriteConfig) => sprite.name === pet.texture.key)!);
                this.switchState(pet, randomState);
                // this.switchState(pet, 'climb');
            }
        }
    }

    isPetOnTheGround(pet: IPet): boolean {
        // we have to check * with scaleY because sometimes user scale the pet
        // and / 2 because the pet anchor is 0.5 :)
        return pet.y >= window.innerHeight - pet.height * pet.scaleY / 2;
    }

    turnOnIgnoreCursorEvents(): void {
        if (!this.isIgnoreCursorEvents) {
            // slight delay to avoid crash when call setIgnoreCursorEvents too fast
            setTimeout(() => {
                appWindow.setIgnoreCursorEvents(true).then(() => {
                    this.isIgnoreCursorEvents = true;
                });
            }, this.setIgnoreCursorEventsDelay);
        }
    }

    turnOffIgnoreCursorEvents(): void {
        if (this.isIgnoreCursorEvents) {
            appWindow.setIgnoreCursorEvents(false).then(() => {
                this.isIgnoreCursorEvents = false;
            })
        }
    }

    detectMouseOverPet(clientX: number, clientY: number): boolean {
        // return Phaser.Geom.Rectangle.Contains(this.pets[0].getBounds(), clientX, clientY);
        this.input.mousePointer.x = clientX;
        this.input.mousePointer.y = clientY;

        // this returns an array of all objects that the pointer is currently over, 
        // if array length > 0, it means the pointer is over some sprite object
        return this.input.hitTestPointer(this.input.activePointer).length > 0
    }

}