import { useEffect, useRef } from "react";
import Cat from "./pets/cat";
import { appWindow } from "@tauri-apps/api/window";
import petConfig from "./settings/pet.config.json";
import { invoke } from "@tauri-apps/api/tauri";

function Canvas() {
    const currentScreenWidth = window.screen.width;
    const currentScreenHeight = window.screen.height;

    // 48 is the height of the taskbar, 64 is the height of the app window
    const positionOfTaskbar = currentScreenHeight - (48 + 64);

    // set app window position to bottom above taskbar
    invoke("change_current_app_position", { x: 0, y: positionOfTaskbar});

    // set app window size to full screen width and 64px height
    invoke("change_current_app_size", { w: currentScreenWidth, h: 64});

    const canvasRef = useRef(null);

    let pets = [];

    // register cat object
    if (petConfig.length > 0) {
        for (let i = 0; i < petConfig.length; i++) {
            pets[i] = new Cat(petConfig[i]);
        }
    }


    //* credit: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    useEffect(() => {

        // const handleDrag = document.getElementById('allowCanvasDrag');
        // handleDrag.addEventListener('mousedown', function (event) {
        //     event.preventDefault()
        //     appWindow.startDragging();
        // });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = currentScreenWidth
        canvas.height = 64;

        function animate() {
            // This code runs the animation loop for the game.
            window.requestAnimationFrame(animate)

            //* credit: https://stackoverflow.com/questions/4815166/how-do-i-make-a-transparent-canvas-in-html5
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Debug purposes
            // context.fillStyle = 'black'
            // context.fillRect(0, 0, canvas.width, canvas.height)

            if (pets.length > 0) {
                for (let i = 0; i < pets.length; i++) {
                    pets[i].animateBehavior();
                    pets[i].update(context);
                }
            }
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