import { useEffect, useRef } from "react";
import { usePetStore } from "./hooks/usePetStore";
import { listen } from '@tauri-apps/api/event';
import { clonePetsFromSettings } from "./utils/clonePetsFromSettings";
import { useSettingStore } from "./hooks/useSettingStore";
import { TRenderEventListener } from "./types/IEvents";

function Canvas() {
    // credit: https://stackoverflow.com/questions/16277383/javascript-screen-height-and-screen-width-returns-incorrect-values
    const DPR: number = window.devicePixelRatio;
    const currentScreenHeight: number = Math.round(DPR * window.screen.height);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const FPS = 60;
    const Interval = 1000 / FPS;
    const requestAnimateFrameId = useRef<number>(0);

    const { pets, isPetsInitialized, setIsPetsInitialized } = usePetStore();
    const { setIsPetAboveTaskbar, setIsAllowHoverOnPet } = useSettingStore();

    // disable right click (context menu) for build version only. uncomment for development
    // credit: https://github.com/tauri-apps/wry/issues/30
    document.addEventListener('contextmenu', event => event.preventDefault());

    useEffect(() => {
        let unListen: () => void;
        listen<any>('render', (event: TRenderEventListener) => {
            switch (event.payload.dispatchType) {
                case 'switchPetAboveTaskBar':
                    setIsPetAboveTaskbar(event.payload!.value as boolean);
                    break;
                case 'switchAllowHoverOnPet':
                    setIsAllowHoverOnPet(event.payload!.value as boolean);
                    break;
                default:
                    return;
            }
            clonePetsFromSettings();
        }).then((unListenFn) => {
            unListen = unListenFn;
        });
        return () => {
            if (unListen) {
                unListen();
            }
        }
    }, [])

    useEffect(() => {
        clonePetsFromSettings();
    }, [isPetsInitialized]);

    useEffect(() => {
        let timeoutId: any;
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
            timeoutId = setTimeout(() => {
                requestAnimateFrameId.current = window.requestAnimationFrame(animate);
            }, Interval);
        }
        requestAnimateFrameId.current = window.requestAnimationFrame(animate);

        return () => {
            clearTimeout(timeoutId);
            window.cancelAnimationFrame(requestAnimateFrameId.current);
            setIsPetsInitialized(false);
        }
    }, [pets]);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default Canvas;