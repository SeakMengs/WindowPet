import { useEffect, useRef } from "react";
import Cat from "./pets/cat";

function Pets() {

    const canvasRef = useRef(null);

    const gingerCat = new Cat({
        position: {
            x: 0,
            y: 0,
        },
        velocity: {
            x: 0,
            y: 0
        },
        imageSrc: 'media/Cat-1/Cat-1-Stretching.png',
        framesMax: 13,
        states: {
            idle: {
                imageSrc: 'media/Cat-1/Cat-1-Idle.png',
                framesMax: 10,
            },
            itch: {
                imageSrc: 'media/Cat-1/Cat-1-Itch.png',
                framesMax: 2,
            },
            laying: {
                imageSrc: 'media/Cat-1/Cat-1-Laying.png',
                framesMax: 8,
            },
            licking: {
                imageSrc: 'media/Cat-1/Cat-1-Licking 1.png',
                framesMax: 5,
            },
            licking2: {
                imageSrc: 'media/Cat-1/Cat-1-Licking 2.png',
                framesMax: 5,
            },
            meow: {
                imageSrc: 'media/Cat-1/Cat-1-Meow.png',
                framesMax: 4,
            },
            sitting: {
                imageSrc: 'media/Cat-1/Cat-1-Sitting.png',
                framesMax: 1,
            },
            sleeping: {
                imageSrc: 'media/Cat-1/Cat-1-Sleeping1.png',
                framesMax: 1,
            },
            sleeping2: {
                imageSrc: 'media/Cat-1/Cat-1-Sleeping2.png',
                framesMax: 1,
            },
            stretching: {
                imageSrc: 'media/Cat-1/Cat-1-Stretching.png',
                framesMax: 13,
            },
            walk: {
                imageSrc: 'media/Cat-1/Cat-1-Walk.png',
                framesMax: 8,
            },
            run: {
                imageSrc: 'media/Cat-1/Cat-1-Run.png',
                framesMax: 8,
            },
        }
    })

    //* credit: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = 1024
        canvas.height = 576

        // context.fillRect(0, 0, canvas.width, canvas.height)

        function animate() {
            // This code runs the animation loop for the game.
            window.requestAnimationFrame(animate)

            context.fillStyle = 'black'
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = 'rgba(255, 255, 255, 0.15)'
            context.fillRect(0, 0, canvas.width, canvas.height)

            gingerCat.update(context);
            gingerCat.velocity.x = 0;
        }

        animate();
    }, [])

    return (
        <div className="">
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Pets;