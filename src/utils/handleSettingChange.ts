import { setSettings, toggleAutoStartUp } from "./settings";
import { IHandleSettingChange } from "../types/ISetting";
import { ColorScheme } from "@mantine/core";
import { useSettingStore } from "../hooks/useSettingStore";
import { emitUpdatePetsEvent } from "./event";
import i18next from "i18next";

export const handleSettingChange: IHandleSettingChange = (dispatchType, newValue) => {
    const { setLanguage, setTheme, setAllowAutoStartUp, setAllowPetAboveTaskbar, setAllowPetInteraction } = useSettingStore.getState();

    switch (dispatchType) {
        case 'changeAppLanguage':
            setSettings({ setKey: 'language', newValue: newValue });
            setLanguage(newValue as string);
            i18next.changeLanguage(newValue as string);
            localStorage.setItem('language', newValue as string);
            return
        case 'changeAppTheme':
            setSettings({ setKey: "theme", newValue: newValue });
            setTheme(newValue as ColorScheme);
            localStorage.setItem('theme', newValue as string);
            return
        case 'switchAutoWindowStartUp':
            // auto start up doesn't need to be saved in settings.json
            toggleAutoStartUp(newValue as boolean);
            setAllowAutoStartUp(newValue as boolean);
            return
        case 'switchPetAboveTaskbar':
            setSettings({ setKey: "allowPetAboveTaskbar", newValue: newValue });
            setAllowPetAboveTaskbar(newValue as boolean);
            emitUpdatePetsEvent({ dispatchType, newValue });
            return
        case 'switchAllowPetInteraction':
            setSettings({ setKey: "allowPetInteraction", newValue: newValue });
            setAllowPetInteraction(newValue as boolean);
            emitUpdatePetsEvent({ dispatchType, newValue });
        case 'addPet':
            emitUpdatePetsEvent({ dispatchType, newValue });
            return
        case 'removePet':
            emitUpdatePetsEvent({ dispatchType, newValue });
            return
        default:
            return;
    }
};