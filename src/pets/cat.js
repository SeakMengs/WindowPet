import Pet from "./petType";

export default class Cat extends Pet {
    constructor({
        // old attribute of PetType
        position,
        imageSrc,
        name,
        scale = 1,
        framesMax = 1,
        // default
        framesCurrent = 0,
        framesElapsed = 0,
        framesHold = 10,
        velocity,
        states,
    }) {
        // generate number from 0 to current screen width
        do {
            position.x = Math.floor(Math.random() * window.screen.width);
        } while (position.x < 0 || position.x > window.screen.width - 100);

        super({
            name,
            position,
            imageSrc,
            scale,
            framesMax,
            framesCurrent,
            framesElapsed,
            framesHold,
            velocity,
            states,
        });

        this.stateNumber = Math.floor(Math.random() * 6000);

        // generate the images for each state
        for (const state in this.states) {
            states[state].image = new Image()
            states[state].image.src = states[state].imageSrc
        }
    }

    switchState(state) {
        for (const _state in this.states) {
            if (_state === state) {
                if (_state !== "walk" && _state !== "run") {
                    this.velocity.x = 0;
                }

                if (this.image !== this.states[_state].image) {
                    this.image = this.states[_state].image
                    this.framesMax = this.states[_state].framesMax
                    this.framesCurrent = 0
                    break;
                }
            }
        }
    }

    animateBehavior() {
        this.stateNumber++;
        this.velocity.x = 0;

        if (this.stateNumber <= 500) {
            this.switchState('idle');
        } else if (this.stateNumber <= 1000) {
            this.switchState('itch');
        } else if (this.stateNumber <= 2000) {
            this.switchState('licking');
        } else if (this.stateNumber <= 2500) {
            this.switchState('licking2');
        } else if (this.stateNumber <= 3000) {
            this.switchState('meow');
        } else if (this.stateNumber <= 3400) {
            this.switchState('sitting');
        } else if (this.stateNumber <= 3500) {
            this.switchState('laying');
        } else if (this.stateNumber <= 4000) {
            this.switchState('sleeping');
        } else if (this.stateNumber <= 5000) {
            this.switchState('sleeping2');
        } else if (this.stateNumber <= 5250) {
            this.switchState('stretching');
        } else if (this.stateNumber <= 7000) {
            this.switchState('walk');
            this.velocity.x += 0.1;
        } else if (this.stateNumber <= 9000) {
            this.switchState('run');
            this.velocity.x += 0.5;
        } else {
            this.stateNumber = 0;
        }
    }
}