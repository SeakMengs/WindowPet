import Pet from "./PetType";

export default class Cat extends Pet {
    constructor({
        // old attribute of PetType
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        // optional
        width = 50,
        height = 150,
        // default
        framesCurrent = 0,
        framesElapsed = 0,
        framesHold = 10,
        // new attribute
        velocity,
        states,
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            width,
            height,
            framesCurrent,
            framesElapsed,
            framesHold,
        });
        this.velocity = velocity;
        this.states = states;

        // generate the images for each state
        for (const state in this.states) {
            states[state].image = new Image()
            states[state].image.src = states[state].imageSrc
        }
    }

    switchState(state) {
        // switch (state) {
        //     case "idle":
        //         if (this.image !== this.states.idle.image) {
        //             this.image = this.states.idle.image
        //             this.framesMax = this.states.idle.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "itch":
        //         if (this.image !== this.states.itch.image) {
        //             this.image = this.states.itch.image
        //             this.framesMax = this.states.itch.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "laying":
        //         if (this.image !== this.states.laying.image) {
        //             this.image = this.states.laying.image
        //             this.framesMax = this.states.laying.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "licking":
        //         if (this.image !== this.states.licking.image) {
        //             this.image = this.states.licking.image
        //             this.framesMax = this.states.licking.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "licking2":
        //         if (this.image !== this.states.licking2.image) {
        //             this.image = this.states.licking2.image
        //             this.framesMax = this.states.licking2.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "meow":
        //         if (this.image !== this.states.meow.image) {
        //             this.image = this.states.meow.image
        //             this.framesMax = this.states.meow.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "sitting":
        //         if (this.image !== this.states.sitting.image) {
        //             this.image = this.states.sitting.image
        //             this.framesMax = this.states.sitting.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "sleeping":
        //         if (this.image !== this.states.sleeping.image) {
        //             this.image = this.states.sleeping.image
        //             this.framesMax = this.states.sleeping.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "sleeping2":
        //         if (this.image !== this.states.sleeping2.image) {
        //             this.image = this.states.sleeping2.image
        //             this.framesMax = this.states.sleeping2.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "stretching":
        //         if (this.image !== this.states.stretching.image) {
        //             this.image = this.states.stretching.image
        //             this.framesMax = this.states.stretching.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "walk":
        //         if (this.image !== this.states.walk.image) {
        //             this.image = this.states.walk.image
        //             this.framesMax = this.states.walk.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        //     case "run":
        //         if (this.image !== this.states.run.image) {
        //             this.image = this.states.run.image
        //             this.framesMax = this.states.run.framesMax
        //             this.framesCurrent = 0
        //         }
        //         break;
        // }
        for (const _state in this.states) {
            if (_state === state) {
                if (this.image !== this.states[_state].image) {
                    this.image = this.states[_state].image
                    this.framesMax = this.states[_state].framesMax
                    this.framesCurrent = 0
                    break;
                }
            }
        }
    }
}