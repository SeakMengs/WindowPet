import { Select } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";
import { useTranslation } from "react-i18next";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { ISettingsContent } from "../../types/ISetting";
import { useSettingStore } from "../../hooks/useSettingStore";
import { memo, useCallback } from "react";
import { IconLanguage } from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api/tauri";
import SettingButton from "./settings/SettingButton";

function Settings() {
    const { t, i18n } = useTranslation();
    const { allowAutoStartUp, allowPetAboveTaskbar, allowPetInteraction } = useSettingStore();

    const settingSwitches: ISettingsContent[] = [
        {
            title: t("Auto start-up"),
            description: t("Automatically open WindowPet every time u start the computer"),
            checked: allowAutoStartUp,
            dispatchType: "switchAutoWindowStartUp",
        },
        {
            title: t("Pet above taskbar"),
            description: t("Make the pet float above taskbar (For Window User)"),
            checked: allowPetAboveTaskbar,
            dispatchType: "switchPetAboveTaskbar",
        },
        {
            title: t("Allow pet interactions"),
            description: t("If allow pet interaction turn on, user will be able to drag and move the pet around their window"),
            checked: allowPetInteraction,
            dispatchType: "switchAllowPetInteraction",
        },
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
                icon={<IconLanguage />}
                my={"sm"}
                label={t("Language")}
                placeholder="Pick one"
                itemComponent={SelectItem}
                data={languages}
                maxDropdownHeight={400}
                value={i18n.language}
                onChange={(value) => handleSettingChange("changeAppLanguage", value as string)}
            />
        </>
    )
}

export default memo(Settings);