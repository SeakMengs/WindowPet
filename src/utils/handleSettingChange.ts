import { setSettings, toggleAutoStartUp } from "./settings";
import { IHandleSettingChange } from "../types/ISetting";
import { ColorScheme } from "@mantine/core";
import { useSettingStore } from "../hooks/useSettingStore";
import { emitReRenderPetsEvent } from "./event";

export const handleSettingChange: IHandleSettingChange = (dispatchType, newValue) => {
    /* 
     * Reading/writing state and reacting to changes outside of components, for more detail read  
     * zustand docs here: https://docs.pmnd.rs/zustand/recipes/recipes
     */
    const { setLanguage, setTheme, setIsAutoStartUp, setIsPetAboveTaskbar, setIsAllowHoverOnPet } = useSettingStore.getState();

    switch (dispatchType) {
        case 'changeAppLanguage':
            setSettings({ setKey: 'language', newValue: newValue });
            setLanguage(newValue as string);
            return
        case 'changeAppTheme':
            setSettings({ setKey: "theme", newValue: newValue });
            setTheme(newValue as ColorScheme);
            return
        case 'switchAutoWindowStartUp':
            // auto start up doesn't need to be saved in settings.json
            toggleAutoStartUp(newValue as boolean);
            setIsAutoStartUp(newValue as boolean);
            return
        case 'switchPetAboveTaskBar':
            setSettings({ setKey: "isPetAboveTaskbar", newValue: newValue });
            setIsPetAboveTaskbar(newValue as boolean);
            emitReRenderPetsEvent({ dispatchType, newValue });
            return
        case 'switchAllowHoverOnPet':
            setSettings({ setKey: "isAllowHoverOnPet", newValue: newValue });
            setIsAllowHoverOnPet(newValue as boolean);
            emitReRenderPetsEvent({ dispatchType, newValue });
        default:
            return;
    }
};