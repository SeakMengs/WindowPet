/* 
 * A good resource to learn about canvas, the project is based on this tutorial.
 * credit: https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=8593s&ab_channel=ChrisCourses
 */

export default class Pet {
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
    }) {
        this.name = name;
        this.velocity = velocity;
        this.position = position;
        this.states = states;

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
    }

    draw(context, flipImage = false) {
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
    flipImage(context) {
        // Calculate the center of the image
        const centerX = this.position.x + (this.image.width / this.framesMax) * this.scale / 2;
        const centerY = this.position.y + this.image.height * this.scale / 2;

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

    checkCollisionWithCanvas(context) {
        const currentPetBeyondRightBorder = this.position.x + (this.image.width / this.framesMax) * this.scale > context.canvas.width;
        const currentPetBeyondLeftBorder = this.position.x < 0;

        if (this.movingDirection === 'left' && currentPetBeyondLeftBorder) {
            this.movingDirection = 'right';
        } else if (this.movingDirection === 'right' && currentPetBeyondRightBorder) {
            this.movingDirection = 'left';
        }
    }

    update(context) {
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

    // calculatePositionYByScale(positionY) {
    //     // Notice: this is a work around to calculate the position y by scale,
    //     // I notice the pattern when scaling the image, the position y will be changed by 32px
    //     // If the scale is 1, the position y will be 32px
    //     // If the scale is 2, the position y will be 0px
    //     // If the scale is 3, the position y will be -32px
    //     // If the scale is 4, the position y will be -64px and so on

    //     let sum = 0;

    //     for (let i = 1; i <= this.scale; i++) {
    //         if (i === 1)  {
    //             sum += 32
    //         } else {
    //             sum -= 32
    //         }
    //     }
    //     return parseInt(positionY + sum);
    // }
}