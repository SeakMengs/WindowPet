import { Select, Button, Group, Text } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";
import { useTranslation } from "react-i18next";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { ISettingsContent } from "../../types/ISetting";
import { useSettingStore } from "../../hooks/useSettingStore";
import { memo } from "react";

function Settings() {
    const { t, i18n } = useTranslation();
    const { allowAutoStartUp, allowPetAboveTaskBar, allowPetInteraction } = useSettingStore();

    const settings: ISettingsContent[] = [
        {
            title: t("Auto start-up"),
            description: t("Automatically open WindowPet every time u start the computer"),
            checked: allowAutoStartUp,
            dispatchType: "switchAutoWindowStartUp",
        },
        {
            title: t("Pet above taskbar"),
            description: t("Make the pet float above taskbar (For Window User)"),
            checked: allowPetAboveTaskBar,
            dispatchType: "switchPetAboveTaskBar",
        },
        {
            title: t("Allow pet interactions"),
            description: t("If allow pet interaction turn on, user will be able to drag and move the pet around their window"),
            checked: allowPetInteraction,
            dispatchType: "switchAllowPetInteraction",
        },
    ];

    const SettingSwitches = settings.map((setting, index) => {
        return <SettingSwitch {...setting} key={index} />
    })

    return (
        <>
            {SettingSwitches}
            <Select
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