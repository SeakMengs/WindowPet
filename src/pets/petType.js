/* 
 * Credit: https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=8593s&ab_channel=ChrisCourses
 */

export default class Pet {
    constructor({
        position,
        imageSrc,
        scale = 1,
        // framesMax is the frames of the image
        framesMax = 1,
        // optional
        width = 50,
        height = 150,
        // default
        framesCurrent = 0,
        framesElapsed = 0,
        framesHold = 10,
    }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = framesCurrent;
        this.framesElapsed = framesElapsed;
        this.framesHold = framesHold;
    }

    draw(context) {
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
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // this.position.x - this.offset.x,
            // this.position.y - this.offset.y,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
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

    update(context) {
        this.draw(context)
        this.animateFrames()
    }
}