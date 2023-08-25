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
    const { isAutoStartUp, isPetAboveTaskBar, isAllowHoverOnPet } = useSettingStore();

    const settings: ISettingsContent = {
        parent: {
            title: t("Setting preferences"),
            description: t("Choose what u desire, do what u love")
        },
        child: [
            {
                title: t("Auto start-up"),
                description: t("Automatically open WindowPet every time u start the computer"),
                checked: isAutoStartUp,
                dispatchType: "switchAutoWindowStartUp",
            },
            {
                title: t("Pet above taskbar"),
                description: t("Make the pet float above taskbar (For Window User)"),
                checked: isPetAboveTaskBar,
                dispatchType: "switchPetAboveTaskBar",
            },
            {
                title: t("Allow hover on pet"),
                description: t("Pets will switch state when u hover on them"),
                checked: isAllowHoverOnPet,
                dispatchType: "switchAllowHoverOnPet",
            },
        ]
    }

    const SettingSwitches = settings.child.map((setting, index) => {
        return <SettingSwitch {...setting} key={index} />
    })

    return (
        <>
            <Text fz={"lg"} fw={500}>{settings.parent.title}</Text>
            <Text fz={"xs"} c={"dimmed"} mt={3} mb={"xl"}>
                {settings.parent.description}
            </Text>
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