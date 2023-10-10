import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { ISpriteConfig } from "../types/ISpriteConfig";
import { useSettingStore } from "../hooks/useSettingStore";
import { listen } from "@tauri-apps/api/event";
import { DispatchType, EventType, TRenderEventListener } from "../types/IEvents";
import { IPet, Direction, IWorldBounding, ISwitchStateOptions, Ease } from "../types/IPet";
import { info, error } from "tauri-plugin-log-api";
import defaultSettings from "../../src-tauri/src/app/default/settings.json";

export default class Pets extends Phaser.Scene {
    private pets: IPet[] = [];
    private spriteConfig: ISpriteConfig[] = [];
    private isIgnoreCursorEvents: boolean = true;
    private isFlipped: boolean = false;
    private frameCount: number = 0;
    // use this array to store index of pet that is currently climb and crawl
    private petClimbAndCrawlIndex: number[] = [];
    private registeredName: string[] = [];

    // app settings
    private allowPetInteraction: boolean = useSettingStore.getState().allowPetInteraction ?? defaultSettings.allowPetInteraction
    private allowPetAboveTaskbar: boolean = useSettingStore.getState().allowPetAboveTaskbar ?? defaultSettings.allowPetAboveTaskbar
    private allowOverridePetScale: boolean = useSettingStore.getState().allowOverridePetScale ?? defaultSettings.allowOverridePetScale
    private petScale: number = useSettingStore.getState().petScale ?? defaultSettings.petScale

    // delay ms to set ignore cursor events
    readonly setIgnoreCursorEventsDelay: number = 50;
    readonly frameRate: number = 9;
    // -1 means repeat forever
    readonly repeat: number = -1;
    readonly forbiddenRandomState: string[] = ['fall', 'climb', 'drag', 'crawl', 'drag', 'bounce', 'jump'];
    readonly movementState: string[] = ['walk', 'jump', 'climb', 'crawl'];
    readonly updateDelay: number = 1000 / this.frameRate;
    readonly moveVelocity: number = this.frameRate * 6;
    readonly moveAcceleration: number = this.moveVelocity * 2;
    readonly tweenAcceleration: number = this.frameRate * 1.1;
    readonly randomStateDelay: number = 3000;
    readonly flipDelay: number = 5000;

    constructor() {
        super({ key: 'Pets' });
    }

    preload(): void {
        this.spriteConfig = this.game.registry.get('spriteConfig');
        const defaultPets = this.game.registry.get('defaultPets');

        // preload all sprite that the app has
        for (let sprite of defaultPets) {
            // if sprite name is duplicate, we skip it because we can use the same key for different sprite object
            if (this.checkDuplicateName(sprite.name)) continue;
            // if pet sprite is not valid, we skip it to avoid error
            if (!this.validatePetSprite(sprite)) continue;

            this.load.spritesheet({
                key: sprite.name,
                url: sprite.imageSrc,
                frameConfig: this.getFrameSize(sprite)
            });
        }

        // preload the sprite of the user, if it has already loaded above, we skip it
        for (let sprite of this.spriteConfig) {
            // if sprite name is duplicate, we skip it because we can use the same key for different sprite object
            if (this.checkDuplicateName(sprite.name)) continue;
            // if pet sprite is not valid, we skip it to avoid error
            if (!this.validatePetSprite(sprite)) continue;

            this.load.spritesheet({
                key: sprite.name,
                url: sprite.imageSrc,
                frameConfig: this.getFrameSize(sprite)
            });
        }
    }

    create(): void {
        this.turnOnIgnoreCursorEvents();
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.updatePetAboveTaskbar();

        // check all loaded sprite (debug only)
        // console.log(this.textures.list);

        let i = 0;
        // create pets
        for (const sprite of this.spriteConfig) {
            this.addPet(sprite, i);
            i++;
        }

        // register event
        this.input.on('drag', (pointer: any, pet: IPet, dragX: number, dragY: number) => {
            pet.x = dragX;
            pet.y = dragY;

            if (pet.anims && pet.anims.getName() !== this.getStateName('drag', pet)) {
                this.switchState(pet, 'drag');
            }

            // disable world bounds when dragging so that pet can go beyond screen
            // @ts-ignore
            if (pet.body!.enable) pet.body!.enable = false;

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
        });

        this.input.on('dragend', (pointer: any, pet: IPet) => {
            // add tween effect when drag end for smooth throw effect
            this.tweens.add({
                targets: pet,
                // x and y is the position of the pet when drag end
                x: pet.x + pointer.velocity.x * this.tweenAcceleration,
                y: pet.y + pointer.velocity.y * this.tweenAcceleration,
                duration: 600,
                ease: Ease.QuartEaseOut,
                onComplete: () => {
                    // enable collision when dragging end so that collision will work again and pet go back to the screen
                    if (!pet.body!.enable) {
                        pet.body!.enable = true;

                        // not sure why when enabling body, velocity become 0, and need to take a while to update velocity
                        setTimeout(() => {
                            switch (pet.anims.getName()) {
                                case this.getStateName('climb', pet):
                                    this.updateDirection(pet, Direction.UP);
                                    break;
                                case this.getStateName('crawl', pet):
                                    this.updateDirection(pet, pet.scaleX === -1 ? Direction.UPSIDELEFT : Direction.UPSIDERIGHT);
                                    break;
                                default:
                                    return;
                            }
                        }, 50);
                    }
                }
            });

            this.petBeyondScreenSwitchClimb(pet, {
                up: this.getPetBoundTop(pet),
                down: this.getPetBoundDown(pet),
                left: this.getPetBoundLeft(pet),
                right: this.getPetBoundRight(pet)
            });
        });

        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean, left: boolean, right: boolean) => {
            const pet = body.gameObject as IPet;
            // if crawl to world bounds, we make the pet jump or spawn on the ground
            if (pet.anims && pet.anims.getName() === this.getStateName('crawl', pet)) {
                if (left || right) {
                    this.petJumpOrPlayRandomState(pet);
                }
                return;
            }

            if (up) {
                if (pet.availableStates.includes('crawl')) {
                    this.switchState(pet, 'crawl')
                    return;
                }
                this.petJumpOrPlayRandomState(pet);
            } else if (down) {
                this.switchStateAfterPetJump(pet);
                this.petOnTheGroundPlayRandomState(pet);
            }

            /*
             * this will check on the ground and mid air if pet is beyond screen
             * and change pet state accordingly
             */
            this.petBeyondScreenSwitchClimb(pet, {
                up: up,
                down: down,
                left: left,
                right: right
            });
        });

        // listen to setting change from setting window and update settings
        listen<any>(EventType.SettingWindowToPetOverlay, (event: TRenderEventListener) => {
            switch (event.payload.dispatchType) {
                case DispatchType.SwitchAllowPetInteraction:
                    this.allowPetInteraction = event.payload.value as boolean;
                    break;
                case DispatchType.SwitchPetAboveTaskbar:
                    this.allowPetAboveTaskbar = event.payload.value as boolean;
                    this.updatePetAboveTaskbar();

                    // when the user switch from pet above taskbar to not above taskbar, there will be a little space for pet, we force pet to jump or play random state
                    if (!this.allowPetAboveTaskbar) {
                        this.pets.forEach((pet) => {
                            this.petJumpOrPlayRandomState(pet);
                        });
                    }

                    break;
                case DispatchType.AddPet:
                    this.addPet(event.payload!.value as ISpriteConfig, this.pets.length);
                    break;
                case DispatchType.RemovePet:
                    this.removePet(event.payload.value as string);
                    break;
                case DispatchType.OverridePetScale:
                    this.allowOverridePetScale = event.payload.value as boolean;
                    this.allowOverridePetScale ?
                        this.scaleAllPets(this.petScale) :
                        this.scaleAllPets(defaultSettings.petScale);
                    break;
                case DispatchType.ChangePetScale:
                    this.petScale = event.payload.value as number;
                    this.scaleAllPets(this.petScale);
                    break;
                default:
                    break;
            }
        })

        info('Pets scene loaded');
    }

    update(time: number, delta: number): void {
        this.frameCount += delta;

        if (this.frameCount >= this.updateDelay) {
            this.frameCount = 0;
            if (this.allowPetInteraction) {
                invoke('get_mouse_position').then((event: any) => {
                    if (this.detectMouseOverPet(event.clientX, event.clientY)) {
                        this.turnOffIgnoreCursorEvents()
                    } else {
                        this.turnOnIgnoreCursorEvents();
                    }
                });
            }

            this.randomJumpIfPetClimbAndCrawl();
        }
    }

    checkDuplicateName(name: string): boolean {
        if (this.registeredName.includes(name)) return true;

        this.registeredName.push(name);
        return false;
    }

    addPet(sprite: ISpriteConfig, index: number): void {
        // avoid showing broken sprite
        if (!this.validatePetSprite(sprite)) return;

        // convert sprite states to lowercase because it help to avoid error when user edit their own json file and type state in uppercase
        for (const state in sprite.states) {
            if (state.toLowerCase() === state) continue;

            sprite.states[state.toLowerCase()] = sprite.states[state];
            delete sprite.states[state];
        }

        // register state animations
        for (const animationConfig of this.getAnimationConfigPerSprite(sprite)) {
            if (this.anims.exists(animationConfig.key)) continue;

            this.anims.create(animationConfig);
        }

        const randomX = Phaser.Math.Between(100, this.physics.world.bounds.width - 100);
        // make the pet jump from the top of the screen
        const petY = 0 + this.getFrameSize(sprite).frameHeight;
        this.pets[index] = this.physics.add.sprite(randomX, petY, sprite.name).setInteractive({
            draggable: true,
            pixelPerfect: true,
        }) as IPet;

        this.allowOverridePetScale ?
            this.scalePet(this.pets[index], this.petScale) :
            this.scalePet(this.pets[index], defaultSettings.petScale);

        this.pets[index].setCollideWorldBounds(true, 0, 0, true);

        // store available states to pet (it actual name, not modified name)
        this.pets[index].availableStates = Object.keys(sprite.states)
        this.pets[index].canPlayRandomState = true;
        this.pets[index].canRandomFlip = true;
        this.pets[index].id = sprite.id as string;

        this.petJumpOrPlayRandomState(this.pets[index]);
    }

    removePet(petId: string): void {
        this.pets = this.pets.filter((pet: IPet, index: number) => {
            if (pet.id === petId) {
                pet.destroy();
                // remove index from petClimbAndCrawlIndex if it exist because the pet is destroyed
                if (this.petClimbAndCrawlIndex.includes(index)) {
                    this.petClimbAndCrawlIndex = this.petClimbAndCrawlIndex.filter(i => i !== index);
                }
                return false;
            }
            return true;
        });
    }

    updateDirection(pet: IPet, direction: Direction): void {
        pet.direction = direction;
        this.updateMovement(pet);
    }

    updateStateDirection(pet: IPet, state: string): void {
        let direction = Direction.UNKNOWN;

        switch (state) {
            case 'walk':
                // if pet.scaleX is negative, it means pet is facing left, so we set direction to left, else right
                direction = pet.scaleX < 0 ? Direction.LEFT : Direction.RIGHT;
                break;
            case 'jump':
                // feel like jump state is opposite of walk so every jump, i flip the pet horizontally :)
                this.toggleFlipX(pet);
                direction = Direction.DOWN;
                break;
            case 'climb':
                direction = Direction.UP;
                break;
            case 'crawl':
                pet.scaleX > 0 ? direction = Direction.UPSIDELEFT : direction = Direction.UPSIDERIGHT;
                break;
            default:
                direction = Direction.UNKNOWN;
                break;
        }

        this.updateDirection(pet, direction);
    };

    // this function will be called every time we update the pet direction using updateDirection
    updateMovement(pet: IPet): void {
        switch (pet.direction) {
            case Direction.RIGHT:
                pet.setVelocity(this.moveVelocity, 0);
                pet.setAcceleration(0);
                this.setPetLookToTheLeft(pet, false);
                break;
            case Direction.LEFT:
                pet.setVelocity(-this.moveVelocity, 0);
                pet.setAcceleration(0);
                this.setPetLookToTheLeft(pet, true);
                break;
            case Direction.UP:
                pet.setVelocity(0, -this.moveVelocity);
                pet.setAcceleration(0);
                break;
            case Direction.DOWN:
                pet.setVelocity(0, this.moveVelocity);
                pet.setAcceleration(0, this.moveAcceleration);
                break;
            case Direction.UPSIDELEFT:
                pet.setVelocity(-this.moveVelocity);
                pet.setAcceleration(0)
                this.setPetLookToTheLeft(pet, true);
                break;
            case Direction.UPSIDERIGHT:
                pet.setVelocity(this.moveVelocity, -this.moveVelocity);
                pet.setAcceleration(0);
                this.setPetLookToTheLeft(pet, false);
                break;
            case Direction.UNKNOWN:
                pet.setVelocity(0);
                pet.setAcceleration(0);
                break;
            default:
                pet.setVelocity(0);
                pet.setAcceleration(0);
                break;
        }

        // if pet is going up, we disable gravity, if pet is going down, we enable gravity
        const isMovingUp = [Direction.UP, Direction.UPSIDELEFT, Direction.UPSIDERIGHT].includes(pet.direction as Direction);

        // Set the gravity according to the direction
        // @ts-ignore
        pet.body!.setAllowGravity(!isMovingUp);

        // Set the horizontal velocityX to zero if the direction is up
        if (pet.direction === Direction.UP) pet.setVelocityX(0);
    }

    switchState(pet: IPet, state: string, options: ISwitchStateOptions = {
        repeat: -1,
        delay: 0,
        repeatDelay: 0,
    }): void {
        try {
            // when pet is destroyed, pet.anims will be undefined, there is a chance that this function get called because of setTimeout
            if (!pet.anims) return;

            const animationKey = this.getStateName(state, pet);
            // if current state is the same as the new state, do nothing
            if (pet.anims && pet.anims.getName() === animationKey) return;
            if (!pet.availableStates.includes(state)) return;

            pet.anims.play({
                key: animationKey,
                repeat: options.repeat,
                delay: options.delay,
                repeatDelay: options.repeatDelay,
            });

            if (state === 'climb' || state === 'crawl') {
                this.petClimbAndCrawlIndex.push(this.pets.indexOf(pet));
            } else {
                this.petClimbAndCrawlIndex = this.petClimbAndCrawlIndex.filter(index => index !== this.pets.indexOf(pet));
            }

            this.updateStateDirection(pet, state);
        } catch (err: any) {
            // error could happen when trying to get name
            error(err);
        }
    }

    // if lookToTheLeft is true, pet will look to the left, if false, pet will look to the right
    setPetLookToTheLeft(pet: IPet, lookToTheLeft: boolean): void {
        if (lookToTheLeft) {
            if (pet.scaleX > 0) {
                this.toggleFlipX(pet);
            }
            return
        }

        if (pet.scaleX < 0) {
            this.toggleFlipX(pet);
        }
    }

    scalePet(pet: IPet, scaleValue: number): void {
        const scaleX = pet.scaleX > 0 ? scaleValue : -scaleValue;
        const scaleY = pet.scaleY > 0 ? scaleValue : -scaleValue;
        pet.setScale(scaleX, scaleY);
    }

    scaleAllPets(scaleValue: number): void {
        this.pets.forEach((pet) => {
            this.scalePet(pet, scaleValue);

            // force pet to jump or play random state when scale change
            this.petJumpOrPlayRandomState(pet);
        });
    }

    toggleFlipX(pet: IPet): void {
        /*
         * using scale because flipX doesn't flip the hitbox
         * so i have to flip the hitbox manually
         * Note: scaleX negative (- value) = direction left, scaleX positive (+ value) = direction right
         */
        // if hitbox is on the right, flip to the left
        pet.scaleX > 0 ? pet.setOffset(pet.width, 0) : pet.setOffset(0, 0);
        pet.setScale(pet.scaleX * -1, pet.scaleY);
    }

    toggleFlipXThenUpdateDirection(pet: IPet): void {
        this.toggleFlipX(pet);

        switch (pet.direction) {
            case Direction.RIGHT:
                this.updateDirection(pet, Direction.LEFT);
                break;
            case Direction.LEFT:
                this.updateDirection(pet, Direction.RIGHT);
                break;
            case Direction.UPSIDELEFT:
                this.updateDirection(pet, Direction.UPSIDERIGHT);
                break;
            case Direction.UPSIDERIGHT:
                this.updateDirection(pet, Direction.UPSIDELEFT);
                break;
            default:
                break;
        }
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

    getHighestFrameMax(sprite: ISpriteConfig): number {
        if (sprite.highestFrameMax) return sprite.highestFrameMax;

        let highestFrameMax = 0;
        for (const state in sprite.states) {
            // if frameMax doesn't exist in sprite.states[state] maybe the user specify specific position using start, end
            if (!sprite.states[state].frameMax!) return 0;
            highestFrameMax = Math.max(highestFrameMax, sprite.states[state].frameMax!);
        }

        return highestFrameMax;
    }

    validatePetSprite(sprite: ISpriteConfig): boolean {
        if (!sprite.name || !sprite.imageSrc || !sprite.states) {
            error(`Invalid sprite config: ${sprite.name ?? 'unknown name'}`);
            return false;
        }

        // technically we accept two type of size, user can either only provide frameSize, or width, height, highestFrameMax, totalSpriteLine for us to calculate frameSize
        if (!sprite.frameSize &&
            (!sprite.width || !sprite.height || !sprite.highestFrameMax || !sprite.totalSpriteLine)
        ) {
            error(`Invalid sprite config: ${sprite.name}`);
            return false;
        }

        for (const state in sprite.states) {
            if (
                (!sprite.states[state].spriteLine || !sprite.states[state].frameMax) &&
                (!sprite.states[state].start || !sprite.states[state].end)
            ) {
                error(`Invalid sprite config: ${sprite.name}`);
                return false;
            }
        }

        return true;
    }

    getAnimationConfigPerSprite(sprite: ISpriteConfig): {
        key: string;
        frames: Phaser.Types.Animations.AnimationFrame[];
        frameRate: number;
        repeat: number;
    }[] {
        let animationConfig = [];
        const HighestFrameMax = this.getHighestFrameMax(sprite);
        for (const state in sprite.states) {

            // we accept to type of state input, either start, end or spriteLine, frameMax
            // -1 because phaser frame start from 0
            const start = sprite.states[state].start !== undefined ?
                sprite.states[state].start! - 1 : (sprite.states[state].spriteLine! - 1) * HighestFrameMax;
            const end = sprite.states[state].end !== undefined ?
                sprite.states[state].end! - 1 : start + sprite.states[state].frameMax! - 1;

            animationConfig.push({
                // avoid duplicate key
                key: `${state}-${sprite.name}`,
                frames: this.anims.generateFrameNumbers(sprite.name, {
                    // -1 because phaser frame start from 0
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

    getStateName(state: string, pet: IPet): string {
        return `${state}-${pet.texture.key}`;
    }

    getOneRandomState(pet: IPet): string {
        let randomStateIndex;

        do {
            randomStateIndex = Phaser.Math.Between(0, pet.availableStates.length - 1);
        } while (this.forbiddenRandomState.includes(pet.availableStates[randomStateIndex]));

        return pet.availableStates[randomStateIndex];
    }

    getOneRandomStateByPet(pet: IPet): string {
        return this.getOneRandomState(pet);
    }

    playRandomState(pet: IPet): void {
        if (!pet.canPlayRandomState) return;

        this.switchState(pet, this.getOneRandomState(pet));
        pet.canPlayRandomState = false;

        // add delay to prevent spamming random state too fast
        setTimeout(() => {
            pet.canPlayRandomState = true;
        }, this.randomStateDelay);
    }

    // this function is for when pet jump to the ground, it will call every time pet hit the ground
    switchStateAfterPetJump(pet: IPet): void {
        if (!pet) return;
        if (pet.anims && pet.anims.getName() !== this.getStateName('jump', pet)) return;

        if (pet.availableStates.includes('fall')) {
            this.switchState(pet, 'fall', {
                repeat: 0,
            });

            // after fall animation complete, we play random state
            pet.canPlayRandomState = false;
            pet.on('animationcomplete', () => {
                pet.canPlayRandomState = true;
                this.playRandomState(pet);
            });

            return
        }
        this.playRandomState(pet);
    }

    getPetGroundPosition(pet: IPet): number {
        return this.physics.world.bounds.height - pet.height * Math.abs(pet.scaleY) * pet.originY;
    }

    getPetTopPosition(pet: IPet): number {
        return pet.height * Math.abs(pet.scaleY) * pet.originY;
    }

    getPetLeftPosition(pet: IPet): number {
        return pet.width * Math.abs(pet.scaleX) * pet.originX;
    }

    getPetRightPosition(pet: IPet): number {
        return this.physics.world.bounds.width - pet.width * Math.abs(pet.scaleX) * pet.originX;
    }

    getPetBoundDown(pet: IPet): boolean {
        // we have to check * with scaleY because sometimes user scale the pet
        return pet.y >= this.getPetGroundPosition(pet);
    }

    getPetBoundLeft(pet: IPet): boolean {
        return pet.x <= this.getPetLeftPosition(pet);
    }

    getPetBoundRight(pet: IPet): boolean {
        return pet.x >= this.getPetRightPosition(pet);
    }

    getPetBoundTop(pet: IPet): boolean {
        return pet.y <= this.getPetTopPosition(pet);
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

    updatePetAboveTaskbar(): void {
        if (this.allowPetAboveTaskbar) {
            // get taskbar height
            const taskbarHeight = window.screen.height - window.screen.availHeight

            // update world bounds to include task bar
            this.physics.world.setBounds(0, 0, window.screen.width, window.screen.height - taskbarHeight);
            return;
        }

        this.physics.world.setBounds(0, 0, window.screen.width, window.screen.height);
    }

    petJumpOrPlayRandomState(pet: IPet): void {
        if (!pet) return;

        if (pet.availableStates.includes('jump')) {
            this.switchState(pet, 'jump');
            return
        }

        this.switchState(pet, this.getOneRandomState(pet));
    }

    petOnTheGroundPlayRandomState(pet: IPet): void {
        if (!pet) return;

        switch (pet.anims.getName()) {
            case this.getStateName('climb', pet):
                return;
            case this.getStateName('crawl', pet):
                return;
            case this.getStateName('drag', pet):
                return;
            case this.getStateName('jump', pet):
                return;
        }

        const random = Phaser.Math.Between(0, 2000);
        if (pet.anims && pet.anims.getName() === this.getStateName('walk', pet)) {
            if (random >= 0 && random <= 5) {
                this.switchState(pet, 'idle');
                setTimeout(() => {
                    if (pet.anims && pet.anims.getName() !== this.getStateName('idle', pet)) return
                    this.switchState(pet, 'walk');
                }, Phaser.Math.Between(3000, 6000));
                return;
            }
        } else {
            // enhance random state if pet is not walk
            if (random >= 777 && random <= 800) {
                this.playRandomState(pet);
                return
            }
        }

        // just some random number to play random state
        if (random >= 888 && random <= 890) {
            // allow random flip only after pet flipped "flipDelay" time
            if (pet.canRandomFlip) {
                this.toggleFlipXThenUpdateDirection(pet);
                pet.canRandomFlip = false;

                // add delay to prevent spamming pet flip too fast
                setTimeout(() => {
                    pet.canRandomFlip = true
                }, this.flipDelay);
            }
        } else if (random >= 777 && random <= 780) {
            this.playRandomState(pet);
        } else if (random >= 170 && random <= 175) {
            this.switchState(pet, 'walk');
        }
    }

    randomJumpIfPetClimbAndCrawl(): void {
        if (this.petClimbAndCrawlIndex.length === 0) return;

        for (const index of this.petClimbAndCrawlIndex) {
            const pet = this.pets[index];
            if (!pet) continue;

            switch (pet.anims.getName()) {
                case this.getStateName('drag', pet):
                    continue;
                case this.getStateName('jump', pet):
                    continue;
            }

            const random = Phaser.Math.Between(0, 500);

            if (random === 78) {
                let newPetx = pet.x;
                // if pet climb, I want the pet to have some opposite x direction when jump
                if (pet.anims && pet.anims.getName() === this.getStateName('climb', pet)) {
                    // if pet.scaleX is negative, it means pet is facing left, vice versa
                    newPetx = pet.scaleX < 0 ? Phaser.Math.Between(pet.x, 500) : Phaser.Math.Between(pet.x, this.physics.world.bounds.width - 500);
                }

                // disable body to prevent shaking when jump
                if (pet.body!.enable) pet.body!.enable = false;
                this.switchState(pet, 'jump');
                // use tween animation to make jump more smooth
                this.tweens.add({
                    targets: pet,
                    x: newPetx,
                    y: this.getPetGroundPosition(pet),
                    duration: 3000,
                    ease: Ease.QuadEaseOut,
                    onComplete: () => {
                        if (!pet.body!.enable) {
                            pet.body!.enable = true;
                            this.switchStateAfterPetJump(pet);
                        }
                    }
                });
                return
            }

            // add random pause when climb
            if (random >= 0 && random <= 5) {
                if (pet.anims && pet.anims.getName() === this.getStateName('climb', pet)) {
                    pet.anims.pause();
                    this.updateDirection(pet, Direction.UNKNOWN);
                    // @ts-ignore
                    pet.body!.allowGravity = false;
                    setTimeout(() => {
                        if (pet.anims && !pet.anims.isPlaying) {
                            pet.anims.resume();
                            this.updateDirection(pet, Direction.UP);
                        }
                    }, Phaser.Math.Between(3000, 6000));
                    return;
                } else if (pet.anims && pet.anims.getName() === this.getStateName('crawl', pet)) {
                    // add random pause when crawl
                    pet.anims.pause();
                    this.updateDirection(pet, Direction.UNKNOWN);
                    // @ts-ignore
                    pet.body!.allowGravity = false;
                    setTimeout(() => {
                        if (pet.anims && !pet.anims.isPlaying) {
                            pet.anims.resume();
                            // if pet.scaleX is negative, it means pet is facing up side left, vice versa
                            this.updateDirection(pet, pet.scaleX < 0 ? Direction.UPSIDELEFT : Direction.UPSIDERIGHT);
                        }
                    }, Phaser.Math.Between(3000, 6000));
                    return;
                }
            }
        }
    }

    petBeyondScreenSwitchClimb(pet: IPet, worldBounding: IWorldBounding): void {
        if (!pet) return;

        // if pet is climb and crawl, we don't want to switch state again
        switch (pet.anims.getName()) {
            case this.getStateName('climb', pet):
                return;
            case this.getStateName('crawl', pet):
                return;
        }

        // ? debug only
        // pet.availableStates = pet.availableStates.filter(state => state !== 'climb');

        if (worldBounding.left || worldBounding.right) {
            if (pet.availableStates.includes('climb')) {
                this.switchState(pet, 'climb');

                const lastPetX = pet.x;
                // const lastPetX = pet.x + pet.width * Math.abs(pet.scaleX) * pet.originX;
                if (worldBounding.left) {
                    /*
                     * not quite sure if this is correct, but after a lot of experiment
                     * i found out that the pet will be stuck at the left side of the screen
                     * which will result in pet.x = negative number. Because we disable and enable
                     * pet body when drag, the pet will go back with absolute value of pet.x
                     * so i get lastPetX to minus with petLeftPosition to get the correct position
                     */
                    pet.setPosition(lastPetX - this.getPetLeftPosition(pet), pet.y);
                    this.setPetLookToTheLeft(pet, true);
                } else {
                    pet.setPosition(lastPetX + this.getPetRightPosition(pet), pet.y);
                    this.setPetLookToTheLeft(pet, false);
                }
            }
            else {
                if (worldBounding.down) {
                    // if pet on the ground and beyond screen and doesn't have climb state, we flip the pet
                    this.toggleFlipXThenUpdateDirection(pet);

                } else {
                    // if pet bounding left or right and not on the ground, we make the pet jump or spawn on the ground
                    this.petJumpOrPlayRandomState(pet);
                }
            }
        } else {
            if (worldBounding.down) {
                // if pet is on the ground after being dragged and they are not bounding left or right, we play random state
                if (pet.anims && pet.anims.getName() === this.getStateName('drag', pet)) {
                    this.switchState(pet, this.getOneRandomState(pet));
                }
            } else {
                // if pet is not on the ground and they are not bounding left or right, we make the pet jump or spawn on the ground
                this.petJumpOrPlayRandomState(pet);
            }
        }
    }

    detectMouseOverPet(clientX: number, clientY: number): boolean {
        // if not pixel perfect, we can detect mouse over pet using this (with loop through pets array)
        // return Phaser.Geom.Rectangle.Contains(this.pets[0].getBounds(), clientX, clientY);

        // divide clientX,Y by window.devicePixelRatio because the game world is not scaled by devicePixelRatio, and the mouse position we get is scaled by devicePixelRatio
        this.input.mousePointer.x = clientX / window.devicePixelRatio;
        this.input.mousePointer.y = clientY / window.devicePixelRatio;

        // this returns an array of all objects that the pointer is currently over, 
        // if array length > 0, it means the pointer is over some sprite object
        return this.input.hitTestPointer(this.input.activePointer).length > 0
    }

}