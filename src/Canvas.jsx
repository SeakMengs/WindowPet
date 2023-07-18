import { useEffect, useRef } from "react";
import Cat from "./pets/cat";
import { tauri } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

function Canvas() {
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
        scale: 2,
        imageSrc: 'media/Cat-1/Cat-1-Idle.png',
        framesMax: 10,
        framesHold: 20,
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

    let state = 0;

    //* credit: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    useEffect(() => {
        const handleDrag = document.getElementById('allowCanvasDrag');
        handleDrag.addEventListener('mousedown', function (event) {
            event.preventDefault()
            appWindow.startDragging();
        });


        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = 128
        // canvas.height = 576
        canvas.height = 64

        function animate() {
            state++;
            console.log(state)
            if (state <= 500) {
                gingerCat.switchState('idle');
            } else if (state <= 1000) {
                gingerCat.switchState('itch');
            } else if (state <= 1500) {
                gingerCat.switchState('laying');
            } else if (state <= 2000) {
                gingerCat.switchState('licking');
            } else if (state <= 2500) {
                gingerCat.switchState('licking2');
            } else if (state <= 3000) {
                gingerCat.switchState('meow');
            } else if (state <= 3500) {
                gingerCat.switchState('sitting');
            } else if (state <= 4000) {
                gingerCat.switchState('sleeping');
            } else if (state <= 4500) {
                gingerCat.switchState('sleeping2');
            } else if (state <= 5000) {
                gingerCat.switchState('stretching');
            } else if (state <= 5500) {
                gingerCat.switchState('walk');
            } else if (state <= 6000) {
                gingerCat.switchState('run');
            } else {
                state = 0;
            }

            // This code runs the animation loop for the game.
            window.requestAnimationFrame(animate)

            //* credit: https://stackoverflow.com/questions/4815166/how-do-i-make-a-transparent-canvas-in-html5
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Debug purposes
            // context.fillStyle = 'black'
            // context.fillRect(0, 0, canvas.width, canvas.height)

            gingerCat.update(context);
            gingerCat.velocity.x = 0;

        }

        animate();
    }, [])

    return (
        <div className="" id="allowCanvasDrag" data-tauri-drag-region>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Canvas;