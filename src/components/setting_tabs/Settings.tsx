import { Select, Button, Group, Text } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";
import { useTranslation } from "react-i18next";
import { enable, isEnabled, disable } from "tauri-plugin-autostart-api";

interface dataProps {
    parent: {
        title: string;
        description: string;
    };
    child: {
        title: string;
        description: string;
        checked: boolean;
        setCheck: Dispatch<SetStateAction<boolean>>;
    }[];
}

const isAutoStartUp = await isEnabled();

function Settings() {
    const { t, i18n } = useTranslation("translation");
    const [language, setLanguage] = useState<string | null>(i18n.language);
    const [autoStartUp, setAutoStartUp] = useState(isAutoStartUp);

    useEffect(() => {
        if (autoStartUp) {
            async function enableAutoStartUp() {
                await enable();
            }
            enableAutoStartUp();
        } else {
            async function disableAutoStartUp() {
                await disable();
            }
            disableAutoStartUp();
        }
    }, [autoStartUp]);

    useEffect(() => {
        i18n.changeLanguage(language as string);
    }, [language]);

    const data = {
        parent: {
            title: t("Setting preferences"),
            description: t("Choose what u desire, do what u love")
        },
        child: [
            {
                title: t("Auto start-up"),
                description: t("Automatically open WindowPet every time u start the computer"),
                checked: autoStartUp,
                setCheck: setAutoStartUp,
            },
        ]
    }

    const settingSwitches = data.child.map((data, index) => {
        return <SettingSwitch {...data} key={index} />
    })

    return (
        <>
            <Text fz={"lg"} fw={500}>{data.parent.title}</Text>
            <Text fz={"xs"} c={"dimmed"} mt={3} mb={"xl"}>
                {data.parent.description}
            </Text>
            {settingSwitches}
            <Select
                my={"sm"}
                label={t("Language")}
                placeholder="Pick one"
                itemComponent={SelectItem}
                data={languages}
                maxDropdownHeight={400}
                value={language}
                onChange={setLanguage}
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