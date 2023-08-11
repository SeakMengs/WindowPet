import { Select, Button, Group, Text } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import { useEffect, useReducer } from "react";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";
import { useTranslation } from "react-i18next";
import { isEnabled } from "tauri-plugin-autostart-api";
import { settingReducer } from "../../hooks/settingReducer";

interface settingsProp {
    parent: {
        title: string;
        description: string;
    };
    child: {
        title: string;
        description: string;
        checked: boolean;
        dispatchType: string;
    }[];
}

// Top level await is now allow in production build.
// creating function and call it like this solve the problem :)
let isAutoStartUp: boolean
async function isAutoStartUpEnabled() {
    isAutoStartUp = await isEnabled();
}
isAutoStartUpEnabled();

function Settings() {
    const { t, i18n } = useTranslation();

    const initialSettingState = {
        language: i18n.language,
        autoStartUp: isAutoStartUp,
    }

    const [state, dispatch] = useReducer(settingReducer, initialSettingState);

    const handleSettingChange = (dispatchType: string, value: any) => {
        dispatch({
            type: dispatchType,
            payload: {
                value: value
            }
        })
    };

    useEffect(() => {
        i18n.changeLanguage(state.language as string);
    }, [state.language]);

    const settings: settingsProp = {
        parent: {
            title: t("Setting preferences"),
            description: t("Choose what u desire, do what u love")
        },
        child: [
            {
                title: t("Auto start-up"),
                description: t("Automatically open WindowPet every time u start the computer"),
                checked: state.autoStartUp,
                dispatchType: "switchAutoWindowStartUp",
            },
        ]
    }

    const SettingSwitches = settings.child.map((setting, index) => {
        return <SettingSwitch {...setting} handleSettingChange={handleSettingChange} key={index} />
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
                value={state.language}
                onChange={(value) => handleSettingChange("changeAppLanguage", value)}
            />
            <Group position={"right"}>
                <Button color="green">
                    {t("Apply")}
                </Button>
                <Button color="red">
                    {t("Cancel")}
                </Button>
            </Group>
        </>
    )
}

export default Settings;