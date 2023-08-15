import { useEffect, useRef } from "react";
import Pet from "./Class/Pet";
import { usePetStore } from "./hooks/usePetStore";
import { getAppSettings } from "./utils/settingsHelper";

function Canvas() {
    // credit: https://stackoverflow.com/questions/16277383/javascript-screen-height-and-screen-width-returns-incorrect-values
    const DPR: number = window.devicePixelRatio;
    const currentScreenHeight: number = Math.round(DPR * window.screen.height);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const FPS = 60;
    const { pets, addPet, clearPets, isPetsInitialized, setIsPetsInitialized } = usePetStore((state) => ({
        pets: state.pets,
        addPet: state.addPet,
        clearPets: state.clearPets,
        isPetsInitialized: state.isPetsInitialized,
        setIsPetsInitialized: state.setIsPetsInitialized
    }));
    // disable right click (context menu) for build version only. uncomment for development
    // credit: https://github.com/tauri-apps/wry/issues/30
    document.addEventListener('contextmenu', event => event.preventDefault());

    //* credit: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
    useEffect(() => {
        getAppSettings({ path: "pets.json" }).then((petConfig) => {
            const petConf = JSON.parse(JSON.stringify(petConfig));

            // prevent pets initialize more than once when pets.json is updated
            if (petConf.length < pets.length) return () => {
                clearPets();
                setIsPetsInitialized(false);
            }

            if (petConf.length > 0 && !isPetsInitialized) {
                for (let i = 0; i < petConf.length; i++) {
                    addPet(new Pet(petConf[i]));
                }
                setIsPetsInitialized(true);
                // console.log("pets initialized");
            }

            if (pets.length === 0 && isPetsInitialized) return;

            // console.log(pets);
            const canvas = canvasRef.current;
            const context = canvas?.getContext("2d");
            canvas!.width = window.innerWidth;;
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
                        pets[i].update(context as CanvasRenderingContext2D);
                    }
                }

                context!.restore();
                setTimeout(() => {
                    window.requestAnimationFrame(animate)
                }, 1000 / FPS);
            }
            animate();
        });
    }, [pets]);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Canvas;