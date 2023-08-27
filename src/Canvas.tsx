import PhaserWrapper from "./PhaserWrapper";
import { useEffect, useState } from "react";
import { TRenderEventListener } from "./types/IEvents";
import { listen } from "@tauri-apps/api/event";
// import spriteJson from "./sprite.json";
import { useSettingStore } from "./hooks/useSettingStore";
import { ISpriteConfig } from "./types/ISpriteConfig";
import useInit from "./hooks/useInit";
import { getAppSettings } from "./utils/settings";

function Canvas() {
  const { setIsPetAboveTaskbar, setIsAllowHoverOnPet } = useSettingStore();
  const [spriteConfig, setSpriteConfig] = useState<ISpriteConfig[]>([]);

  useInit(() => {
    getAppSettings({configName: "pets.json"}).then((settings) => {
      setSpriteConfig(settings);
    });
  });

  useEffect(() => {
    let unListen: () => void;
    listen<any>('render', (event: TRenderEventListener) => {
      switch (event.payload.dispatchType) {
        case 'switchPetAboveTaskBar':
          setIsPetAboveTaskbar(event.payload!.value as boolean);
        case 'switchAllowHoverOnPet':
          setIsAllowHoverOnPet(event.payload!.value as boolean);
          break;
        default:
          return;
      }
    }).then((unListenFn) => {
      unListen = unListenFn;
    });

    return () => {
      if (unListen) {
        unListen();
      }
    }
  }, [])

  return (
    <PhaserWrapper key={1} />
  );
}

export default Canvas;