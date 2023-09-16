import { memo, useEffect, useState } from "react";
import { Anchor, Avatar, Button, Flex, Text } from "@mantine/core";
import { open } from "@tauri-apps/api/shell";
import { ButtonVariant } from "../../utils";
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from "react-i18next";

function About() {
    const { t } = useTranslation();
    const [appVersion, setAppVersion] = useState('.....');

    useEffect(() => {
        getVersion().then((version) => {
            setAppVersion(version);
        });
    }, []);

    return (
        <Flex align={"center"} justify={"center"} direction={"column"} gap={"md"}>
            <Avatar
                src="/media/icon.png"
                alt="WindowPet"
                w={128}
                h={128}
            />
            <Text display={"flex"}>{t("Version", { version: appVersion })}
                <Anchor mx={"xs"} onClick={() => open(`https://github.com/SeakMengs/WindowPet/releases/tag/v${appVersion}`)}>{t("(release note)")}</Anchor>
            </Text>
            {/* <Text color="dimmed">{t("You have the latest version", { lastCheck: "(last checked 1minute ago)" })}</Text> */}
            <Button variant={ButtonVariant}>
                {t("Check for updates")}
            </Button>
            <Text display={"flex"}>{t("Developed by:")}
                <Anchor mx={"xs"} onClick={() => open("https://github.com/SeakMengs")}>@Seakmeng</Anchor>
            </Text>
            <Text display={"flex"}>{t("Source code:")}
                <Anchor mx={"xs"} onClick={() => open("https://github.com/SeakMengs/WindowPet")}>@SeakMengs/WindowPet</Anchor>
            </Text>
        </Flex>
    )
}

export default memo(About);