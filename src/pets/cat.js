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
        framesHold = 9,
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
}