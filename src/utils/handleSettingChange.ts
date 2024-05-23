import { setSettings, toggleAutoStartUp } from "./settings";
import { ColorScheme } from "../types/ISetting";
import { useSettingStore } from "../hooks/useSettingStore";
import { emitUpdatePetsEvent } from "./event";
import i18next from "i18next";
import { info } from "tauri-plugin-log-api";
import { DispatchType } from "../types/IEvents";
import { ISpriteConfig } from "../types/ISpriteConfig";

interface IHandleSettingChange {
    (
        dispatchType: DispatchType,
        newValue: string | boolean | ISpriteConfig | number,
    ): void;
}
export const handleSettingChange: IHandleSettingChange = (
    dispatchType,
    newValue
) => {
    const {
        setLanguage,
        setTheme,
        setAllowAutoStartUp,
        setAllowPetAboveTaskbar,
        setAllowPetInteraction,
        setAllowOverridePetScale,
        setPetScale,
        setAllowPetClimbing,
    } = useSettingStore.getState();

    info(`Change setting, type: ${dispatchType}, value: ${newValue}`);

    switch (dispatchType) {
        case DispatchType.ChangeAppLanguage:
            setSettings({ setKey: "language", newValue: newValue });
            setLanguage(newValue as string);
            i18next.changeLanguage(newValue as string);
            localStorage.setItem("language", newValue as string);
            return;
        case DispatchType.ChangeAppTheme:
            setSettings({ setKey: "theme", newValue: newValue });
            setTheme(newValue as ColorScheme);
            localStorage.setItem("theme", newValue as string);
            return;
        case DispatchType.SwitchAutoWindowStartUp:
            // auto start up doesn't need to be saved in settings.json
            toggleAutoStartUp(newValue as boolean);
            setAllowAutoStartUp(newValue as boolean);
            return;
        case DispatchType.SwitchPetAboveTaskbar:
            setSettings({ setKey: "allowPetAboveTaskbar", newValue: newValue });
            setAllowPetAboveTaskbar(newValue as boolean);
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        case DispatchType.SwitchAllowPetInteraction:
            setSettings({ setKey: "allowPetInteraction", newValue: newValue });
            setAllowPetInteraction(newValue as boolean);
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        case DispatchType.SwitchAllowPetClimbing:
            setSettings({ setKey: "allowPetClimbing", newValue: newValue });
            setAllowPetClimbing(newValue as boolean);
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        case DispatchType.AddPet:
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        case DispatchType.RemovePet:
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        case DispatchType.OverridePetScale:
            setSettings({
                setKey: "allowOverridePetScale",
                newValue: newValue,
            });
            setAllowOverridePetScale(newValue as boolean);
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        case DispatchType.ChangePetScale:
            setSettings({ setKey: "petScale", newValue: newValue });
            setPetScale(newValue as number);
            emitUpdatePetsEvent({ dispatchType, newValue });
            return;
        default:
            return;
    }
};
