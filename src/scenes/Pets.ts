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
    private allowPetAboveTaskBar: boolean = useSettingStore.getState().allowPetAboveTaskBar

    // delay ms to set ignore cursor events
    readonly setIgnoreCursorEventsDelay: number = 50;
    readonly frameRate: number = 15;
    // -1 means repeat forever
    readonly repeat: number = -1;
    readonly forbiddenRandomState: string[] = ['fall', 'climb', 'drag', 'crawl'];
    readonly movementState: string[] = ['walk', 'fall', 'climb', 'crawl', 'drag'];
    readonly updateDelay: number = 1000 / this.frameRate;
    // velocity will depend on frameRate
    readonly moveVelocity: number = this.frameRate * 2;

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
        this.physics.world.setBoundsCollision(false, false, false, true);

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
            }) as IPet;
            this.pets[i].setCollideWorldBounds(true, 0, 0, true);

            this.pets[i].availableStates = Object.keys(sprite.states);
            // store available states to pet (it's actual name, not modified name)
            if (this.pets[i].availableStates.includes('fall')) {
                this.switchState(this.pets[i], 'fall');
            } else {
                // play random state
                this.switchState(this.pets[i], this.getOneRandomState(this.pets[i]));
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
            // if (pet.x > pet.input!.dragStartX) {
            //     if (this.isFlipped) {
            //         this.toggleFlipX(pet);
            //         this.isFlipped = false;
            //     }
            // } else {
            //     if (!this.isFlipped) {
            //         this.toggleFlipX(pet);
            //         this.isFlipped = true;
            //     }
            // }

            // temporary stop fall 
            // @ts-ignore
            pet.body.setAllowGravity(false);
        });

        this.input.on('dragend', (pointer: any, pet: IPet) => {
            // @ts-ignore
            pet.body!.setAllowGravity(true);

            // if pet go out of screen, reset pet position to most left or most right
            
            if (pet.anims.getName() === `drag-${pet.texture.key}`) {
                // if pet go out of screen, reset pet position to most left or most right
                // if (this.isPetOnTheLeft(pet)) {
                //     console.log('left');
                //     pet.setPosition(pet.width * pet.scaleX * pet.originX, pet.y);
                // } else {
                //     console.log('right');
                //     pet.setPosition(this.physics.world.bounds.width - pet.width * pet.scaleX * pet.originX, pet.y);
                //     this.toggleFlipX(pet);
                // }
            }

            this.switchState(pet, 'fall');
        });

        this.updatePetAboveTaskBar();

        // listen to setting change from setting window and update settings
        listen<any>('render', (event: TRenderEventListener) => {
            switch (event.payload.dispatchType) {
                case 'switchAllowPetInteraction':
                    this.allowPetInteraction = event.payload!.value as boolean;
                    break;
                case 'switchPetAboveTaskBar':
                    this.allowPetAboveTaskBar = event.payload!.value as boolean;
                    this.updatePetAboveTaskBar();
                default:
                    break;
            }
        })
    }

    update(time: number, delta: number): void {
        this.frameCount += delta;

        if (this.frameCount >= this.updateDelay) {
            this.frameCount = 0;
            this.pets.forEach(pet => {
                console.log(pet.x);
                // top
                if (this.isPetOnTheTop(pet)) {
                    this.switchState(pet, 'fall');
                    // down
                } else if (this.isPetOnTheGround(pet)) {
                    this.switchStateAfterPetFall(pet);
                    this.playRandomState(pet);

                    if (this.isPetOnTheLeft(pet) || this.isPetOnTheRight(pet)) {
                        this.petClimbOrFlip(pet);
                    }
                    // left or right
                } else if (this.isPetOnTheLeft(pet) || this.isPetOnTheRight(pet)) {
                    if (pet.availableStates.includes('climb')) {
                        this.switchState(pet, 'climb');
                    } else {
                        this.switchState(pet, 'fall');
                    }
                }

            });

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
                pet.setVelocityY(this.moveVelocity);
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

    switchState(pet: IPet, state: string, delay: number = 0): void {
        // if current state is the same as the new state, do nothing
        if (pet.anims.getName() === `${state}-${pet.texture.key}`) {
            return;
        }

        pet.anims.play({
            key: `${state}-${pet.texture.key}`,
            delay: delay,
        });

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

    getOneRandomState(pet: IPet): string {
        let randomState;

        do {
            randomState = Phaser.Math.Between(0, pet.availableStates.length - 1);
        } while (this.forbiddenRandomState.includes(pet.availableStates[randomState]));

        return pet.availableStates[randomState];
    }

    getOneRandomStateByPet(pet: IPet): string {
        return this.getOneRandomState(pet);
    }

    playRandomState(pet: IPet): void {
        if (pet.anims.getName() === `drag-${pet.texture.key}`) {
            return;
        }

        // this.switchState(pet, this.getOneRandomStateByPet(pet));
    }

    // this function is for when pet fall to the ground, it will call every time pet hit the ground
    switchStateAfterPetFall(pet: IPet): void {
        if (pet.anims.getName() === `fall-${pet.texture.key}`) {
            this.switchState(pet, this.getOneRandomStateByPet(pet));
        }
    }

    petClimbOrFlip(pet: IPet): void {
        // if the pet state has climb we make the pet climb the wall
        if (pet.availableStates.includes('climb')) {
            this.switchState(pet, 'climb');
            return
        }

        this.toggleFlipXThenUpdateDirection(pet);
    }

    isPetOnTheGround(pet: IPet): boolean {
        // we have to check * with scaleY because sometimes user scale the pet
        return pet.y >= this.physics.world.bounds.height - pet.height * pet.scaleY * pet.originY;
    }

    isPetOnTheLeft(pet: IPet): boolean {
        return pet.x <= pet.width * pet.scaleX * pet.originX;
    }

    isPetOnTheRight(pet: IPet): boolean {
        return pet.x >= this.physics.world.bounds.width - pet.width * pet.scaleX * pet.originX;
    }

    isPetOnTheTop(pet: IPet): boolean {
        return pet.y <= pet.height * pet.scaleY * pet.originY;
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

    updatePetAboveTaskBar(): void {
        if (this.allowPetAboveTaskBar) {
            // get taskbar height
            const taskbarHeight = window.innerHeight - screen.availHeight

            // update world bounds to include task bar
            this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight - taskbarHeight);
        } else {
            this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
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