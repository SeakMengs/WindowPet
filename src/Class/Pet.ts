import { H } from "@tauri-apps/api/path-c062430b";

/* 
 * A good resource to learn about canvas, the project is based on this tutorial.
 * credit: https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=8593s&ab_channel=ChrisCourses
*/
type PetState = {
    imageSrc: string;
    framesMax: number;
    stateHold: number;
    framesHold: number;
    image?: HTMLImageElement;
};

type CurrentPetState = {
    state: string;
    index?: number;
    stateHold: number;
};

interface PetParams {
    position: { x: number; y: number };
    name: string;
    currentState: CurrentPetState;
    velocity: { x: number; y: number };
    scale?: number;
    framesMax?: number;
    framesCurrent?: number;
    framesElapsed?: number;
    framesHold?: number;
    states: Record<string, PetState>;
    walkSpeed?: number;
    runSpeed?: number;
}

export default class Pet {
    position: { x: number; y: number };
    name: string;
    velocity: { x: number; y: number };
    states: Record<string, PetState>;
    stateNumber: number;
    currentState: CurrentPetState;
    image: HTMLImageElement;
    imageSrc: string;
    scale: number;
    framesMax: number;
    framesCurrent: number;
    framesElapsed: number;
    framesHold: number;
    movingDirection: 'left' | 'right';
    walkSpeed: number;
    runSpeed: number;

    constructor({
        position,
        name,
        currentState,
        velocity,
        scale = 1,
        // framesMax is the frames of the image
        framesMax = 1,
        // default
        framesCurrent = 0,
        framesElapsed = 0,
        framesHold = 20,
        states,
        walkSpeed = 0.1,
        runSpeed = 0.5,
    }: PetParams) {
        // generate number from 0 to current screen width
        do {
            position.x = Math.floor(Math.random() * window.screen.width);
        } while (position.x < 0 || position.x > window.screen.width - 100);
        this.position = position;
        this.name = name;
        this.velocity = velocity;
        this.states = states;


        this.stateNumber = Math.floor(Math.random() * 500);

        // default state from config but we want to randomize the state
        // this.currentState = currentState;
        this.currentState = this.generateOneRandomState();

        this.image = new Image();
        this.imageSrc = this.states[this.currentState.state].imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = framesCurrent;
        this.framesElapsed = framesElapsed;
        this.framesHold = framesHold;
        this.movingDirection = Math.random() < 0.5 ? 'left' : 'right';
        this.walkSpeed = walkSpeed;
        this.runSpeed = runSpeed;

        // generate the images for each state
        for (const state in this.states) {
            this.states[state].image = new Image();
            this.states[state].image!.src = states[state].imageSrc
        }
    }

    draw(context: CanvasRenderingContext2D, flipImage = false) {
        /* 
         * context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
         * image: Image object
         * sx: Source x. It's where u start to crop the image in the x axis
         * sy: Source y. It's where u start to crop the image in the y axis
         * sWidth: Source width. It's the width of the image that u want to crop
         * sHeight: Source height. It's the height of the image that u want to crop
         * dx: Destination x. It's where u start to draw the image in the x axis
         * dy: Destination y. It's where u start to draw the image in the y axis
         * dWidth: Destination width. It's the width of the image that u want to draw
         * dHeight: Destination height. It's the height of the image that u want to draw
         */

        if (flipImage) {
            this.flipImage(context)
        } else {
            context.drawImage(
                this.image,
                (this.framesCurrent * (this.image.width / this.framesMax)),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x,
                this.position.y,
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            )
        }
    }

    //Credit: https://stackoverflow.com/questions/35973441/how-to-horizontally-flip-an-image
    flipImage(context: CanvasRenderingContext2D) {
        // Calculate the center of the image
        const centerX: number = this.position.x + (this.image.width / this.framesMax) * this.scale / 2;
        const centerY: number = this.position.y + this.image.height * this.scale / 2;

        context.translate(centerX, centerY);
        context.scale(-1, 1);

        context.drawImage(
            this.image,
            (this.framesCurrent * (this.image.width / this.framesMax)),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            -(this.image.width / this.framesMax) * this.scale / 2,
            -this.image.height * this.scale / 2,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );

        // 4. Reset the context back to its original state
        context.setTransform(1, 0, 0, 1, 0, 0);
    }


    // used to control the animation speed,
    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    checkCollisionWithCanvas(context: CanvasRenderingContext2D) {
        const currentPetBeyondRightBorder = this.position.x + (this.image.width / this.framesMax) * this.scale > context.canvas.width;
        const currentPetBeyondLeftBorder = this.position.x < 0;

        if (this.movingDirection === 'left' && currentPetBeyondLeftBorder) {
            this.movingDirection = 'right';
        } else if (this.movingDirection === 'right' && currentPetBeyondRightBorder) {
            this.movingDirection = 'left';
        }
    }

    update(context: CanvasRenderingContext2D) {
        this.checkCollisionWithCanvas(context);

        this.draw(context, this.movingDirection === 'left');
        this.animateFrames();

        if (this.movingDirection === 'left') {
            this.position.x -= this.velocity.x
        } else {
            this.position.x += this.velocity.x
        }
        this.position.y += this.velocity.y

        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    switchState(state: string) {
        // console.log('switchState', state);
        if (this.image !== this.states[state].image) {
            this.image = this.states[state].image as HTMLImageElement;
            this.framesMax = this.states[state].framesMax;
            this.framesHold = this.states[state].framesHold;
            this.currentState.stateHold = this.states[state].stateHold;
            this.currentState.state = state;
            this.framesCurrent = 0;
        }
    }

    animateBehavior() {
        this.stateNumber++;

        switch (this.currentState.state) {
            case 'walk':
                this.velocity.x += this.walkSpeed;
                break;
            case 'run':
                this.velocity.x += this.runSpeed;
                break;
            default:
                this.velocity.x = 0;
                break;
        }

        if (this.stateNumber < this.currentState.stateHold) {
            this.switchState(this.currentState.state);
            return
        }

        this.stateNumber = 0;
        this.currentState.index!++;

        if (this.currentState.index! >= Object.keys(this.states).length) {
            this.currentState.index = 0;
        }

        const state = Object.keys(this.states)[this.currentState.index!];
        this.switchState(state);
    }

    generateOneRandomState() {
        const states = Object.keys(this.states);
        const index = Math.floor(Math.random() * states.length);
        const randomState = states[index];

        return {
            state: randomState,
            index: index,
            stateHold: this.states[randomState].stateHold,
        };
    }

}