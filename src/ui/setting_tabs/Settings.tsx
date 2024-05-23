import { Select, Slider } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";
import { useTranslation } from "react-i18next";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { useSettingStore } from "../../hooks/useSettingStore";
import { memo, useCallback } from "react";
import { IconLanguage } from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api/tauri";
import SettingButton from "./settings/SettingButton";
import { DispatchType } from "../../types/IEvents";

interface ISettingsContent {
    title: string,
    description: string,
    checked: boolean,
    dispatchType: DispatchType,
    component?: React.ReactNode,
}

function Settings() {
    const { t, i18n } = useTranslation();
    const { allowAutoStartUp, allowPetAboveTaskbar, allowPetInteraction, allowOverridePetScale, petScale, allowPetClimbing } = useSettingStore();

    const settingSwitches: ISettingsContent[] = [
        {
            title: t("Auto start-up"),
            description: t("Automatically open WindowPet every time u start the computer"),
            checked: allowAutoStartUp,
            dispatchType: DispatchType.SwitchAutoWindowStartUp,
        },
        {
            title: t("Pet above taskbar"),
            description: t("Make the pet float above taskbar (For Window User)"),
            checked: allowPetAboveTaskbar,
            dispatchType: DispatchType.SwitchPetAboveTaskbar,
        },
        {
            title: t("Pet interactions"),
            description: t("If allow pet interaction turn on, user will be able to drag and move the pet around their window"),
            checked: allowPetInteraction,
            dispatchType: DispatchType.SwitchAllowPetInteraction,
        },
        {
            title: t("Allow pet climb"),
            description: t("If allow pet climb turn on, pet will be able to climb on the left, right, and top of the window"),
            checked: allowPetClimbing,
            dispatchType: DispatchType.SwitchAllowPetClimbing,
        },
        {
            title: t("Override pet scale"),
            description: t("Allow the program to adjust all pet sizes by a fixed amount determined by your preferences, ignoring any individual pet scales"),
            checked: allowOverridePetScale,
            dispatchType: DispatchType.OverridePetScale,
            component: allowOverridePetScale &&
                <Slider min={0.1} max={1} defaultValue={petScale} my={"sm"} step={0.1} onChangeEnd={(value) => handleSettingChange(DispatchType.ChangePetScale, value)} />,
        }
    ];

    const SettingSwitches = settingSwitches.map((setting, index) => {
        return <SettingSwitch {...setting} key={index} />
    })

    const openConfigFolder = useCallback(async () => {
        const configPath: string = await invoke("combine_config_path", { config_name: "" });
        await invoke("open_folder", { path: configPath });
    }, []);

    return (
        <>
            {SettingSwitches}
            <SettingButton title={t("App Config Path")} description={t(`The location path of where the app store your config such as settings, pets, etc`)} btnLabel={t("Open")} btnFunction={openConfigFolder} />
            <Select
                leftSection={<IconLanguage />}
                allowDeselect={false}
                checkIconPosition={"right"}
                my={"sm"}
                label={t("Language")}
                placeholder="Pick one"
                // itemComponent={SelectItem}
                data={languages}
                maxDropdownHeight={400}
                value={i18n.language}
                onChange={(value) => handleSettingChange(DispatchType.ChangeAppLanguage, value as string)}
            />
        </>
    )
}

export default memo(Settings);