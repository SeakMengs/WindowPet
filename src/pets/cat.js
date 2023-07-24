import Pet from "./petType";

export default class Cat extends Pet {
    constructor({
        // old attribute of PetType
        position,
        name,
        currentState,
        scale = 1,
        framesMax = 1,
        // default
        framesCurrent = 0,
        framesElapsed = 0,
        framesHold = 20,
        velocity,
        states,
        walkSpeed = 0.1,
        runSpeed = 0.5,
    }) {
        // generate number from 0 to current screen width
        do {
            position.x = Math.floor(Math.random() * window.screen.width);
        } while (position.x < 0 || position.x > window.screen.width - 100);

        super({
            name,
            currentState,
            position,
            scale,
            framesMax,
            framesCurrent,
            framesElapsed,
            framesHold,
            velocity,
            states,
            walkSpeed,
            runSpeed,
        });

        this.stateNumber = 0;

        // generate the images for each state
        for (const state in this.states) {
            this.states[state].image = new Image()
            this.states[state].image.src = states[state].imageSrc
        }
    }

    switchState(state) {
        // console.log('switchState', state);
        if (this.image !== this.states[state].image) {
            this.image = this.states[state].image;
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
        this.currentState.index++;

        if (this.currentState.index >= Object.keys(this.states).length) {
            this.currentState.index = 0;
        }

        const state = Object.keys(this.states)[this.currentState.index];
        this.switchState(state);
    }
}