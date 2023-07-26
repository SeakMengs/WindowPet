import { useEffect, useRef } from "react";
import Pet from "./Class/Pet";
import { appWindow } from "@tauri-apps/api/window";
import petConfig from "./settings/pet.config.json";
import { invoke } from "@tauri-apps/api/tauri";

function Canvas() {
    // credit: https://stackoverflow.com/questions/16277383/javascript-screen-height-and-screen-width-returns-incorrect-values
    const DPR = window.devicePixelRatio;
    const canvasHeight = 64 * DPR;
    const currentScreenWidth = Math.round(DPR * window.screen.width);
    const currentScreenHeight = Math.round(DPR * window.screen.height);

    // 48 is the height of the taskbar
    const positionOfTaskbar = currentScreenHeight - ((48 * DPR) + canvasHeight);

    // set app window position to bottom above taskbar
    invoke("change_current_app_position", { x: 0, y: positionOfTaskbar });
    invoke("change_current_app_size", { w: currentScreenWidth, h: canvasHeight });

    const canvasRef = useRef(null);

    // disable right click (context menu) for build version only. uncomment for development
    // credit: https://github.com/tauri-apps/wry/issues/30
    document.addEventListener('contextmenu', event => event.preventDefault());

    let pets = [];

    //* credit: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    useEffect(() => {
        // register cat object
        if (petConfig.length > 0) {
            for (let i = 0; i < petConfig.length; i++) {
                pets[i] = new Pet(petConfig[i]);
            }
        }

        // const handleDrag = document.getElementById('allowCanvasDrag');
        // handleDrag.addEventListener('mousedown', function (event) {
        //     event.preventDefault()
        //     appWindow.startDragging();
        // });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = currentScreenWidth
        canvas.height = canvasHeight;

        function animate() {
            context.imageSmoothingEnabled = false;

            window.requestAnimationFrame(animate)

            // credit: https://stackoverflow.com/questions/4815166/how-do-i-make-a-transparent-canvas-in-html5
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
    }, [petConfig])

    return (
        <div id="allowCanvasDrag" data-tauri-drag-region>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Canvas;