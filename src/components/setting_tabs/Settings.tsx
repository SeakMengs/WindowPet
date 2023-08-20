import { Select, Button, Group, Text, Divider } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";
import { useTranslation } from "react-i18next";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { SettingsContent } from "../../utils/type";
import { useSettingStore } from "../../hooks/useSettingStore";

function Settings() {
    const { t, i18n } = useTranslation();
    const { isAutoStartUp, isPetAboveTaskBar } = useSettingStore();

    const settings: SettingsContent = {
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
            {/* <Group position={"right"}>
                <Button color="green">
                    {t("Apply")}
                </Button>
                <Button color="red">
                    {t("Cancel")}
                </Button>
            </Group> */}
    </>
    )
}

export default Settings;