import { useEffect, useRef } from "react";
import Pet from "./Class/Pet";
// import { appWindow } from "@tauri-apps/api/window";
import petConfig from "./settings/pet.config.json";

function Canvas() {
    // credit: https://stackoverflow.com/questions/16277383/javascript-screen-height-and-screen-width-returns-incorrect-values
    const DPR: number = window.devicePixelRatio;
    const currentScreenHeight: number = Math.round(DPR * window.screen.height);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const FPS = 60;

    // disable right click (context menu) for build version only. uncomment for development
    // credit: https://github.com/tauri-apps/wry/issues/30
    document.addEventListener('contextmenu', event => event.preventDefault());

    //* credit: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    useEffect(() => {
        // deep clone pet config to prevent reference error
        const deepClonePetConfig = JSON.parse(JSON.stringify(petConfig))
        let pets: any = [];
        // register cat object
        if (deepClonePetConfig.length > 0) {
            for (let i = 0; i < deepClonePetConfig.length; i++) {
                pets[i] = new Pet(deepClonePetConfig[i]);
            }
        }

        // const handleDrag = document.getElementById('allowCanvasDrag');
        // handleDrag.addEventListener('mousedown', function (event) {
        //     event.preventDefault()
        //     appWindow.startDragging();
        // });

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        canvas!.width =  window.innerWidth;;
        canvas!.height = currentScreenHeight;

        function animate() {
            context!.save();
            context!.imageSmoothingEnabled = false;
            
            // credit: https://stackoverflow.com/questions/4815166/how-do-i-make-a-transparent-canvas-in-html5
            context!.clearRect(0, 0, canvas!.width, canvas!.height);
            
            // Debug purposes
            // context.fillStyle = 'black'
            // context.fillRect(0, 0, canvas.width, canvas.height)
            
            if (pets.length > 0) {
                for (let i = 0; i < pets.length; i++) {
                    pets[i].animateBehavior();
                    pets[i].update(context);
                }
            }
            
            context!.restore();

            setTimeout(() => {
                window.requestAnimationFrame(animate)
            }, 1000 / FPS);
        }

        animate();

        return () => {
            // cleanup
            pets = [];
        }

    }, [petConfig])

    return (
        <div id="allowCanvasDrag" data-tauri-drag-region>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Canvas;