import { memo, useEffect, useState } from "react";
import { Anchor, Avatar, Button, Flex, Loader, Text } from "@mantine/core";
import { open } from "@tauri-apps/api/shell";
import { ButtonVariant } from "../../utils";
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from "react-i18next";
import { checkForUpdate } from "../../utils/update";

function About() {
    const { t } = useTranslation();
    const [appVersion, setAppVersion] = useState('.....');
    const [checkingForUpdate, setCheckingForUpdate] = useState(false);
    const [isLatestVersion, setIsLatestVersion] = useState(false);

    const checkUpdate = async () => {
        if (!checkingForUpdate) {
            setCheckingForUpdate(true);
            const hasUpdate = await checkForUpdate()
            hasUpdate ? setIsLatestVersion(false) : setIsLatestVersion(true);
            setCheckingForUpdate(false);
        }
    }

    useEffect(() => {
        getVersion().then((version) => {
            setAppVersion(version);
        });
        checkUpdate();
    }, []);

    return (
        <Flex align={"center"} justify={"center"} direction={"column"} gap={"md"}>
            <Avatar
                src="/media/icon.png"
                alt="WindowPet"
                w={128}
                h={128}
            />
            <Text fw={700}>WindowPet</Text>
            <Text display={"flex"}>{t("Version", { version: appVersion })}
                <Anchor mx={"xs"} onClick={() => open(`https://github.com/SeakMengs/WindowPet/releases/tag/v${appVersion}`)}>{t("(release note)")}</Anchor>
            </Text>
            {
                checkingForUpdate &&
                <Flex align={"center"} justify={"center"} gap={"xs"}>
                    <Loader />
                    <Text color="dimmed">{t("Checking for updates")}</Text>
                </Flex>
            }
            {
                isLatestVersion ?
                    !checkingForUpdate && <Text color="dimmed">{t("You have the latest version", { lastCheck: '' })}</Text>
                    :
                    !checkingForUpdate && <Text color="dimmed">{t("There is a new version available", { lastCheck: '' })}</Text>
            }
            <Button variant={ButtonVariant} onClick={checkUpdate}>
                {t("Check for updates")}
            </Button>
            <Text display={"flex"}>{t("Developed by:")}
                <Anchor mx={"xs"} onClick={() => open("https://github.com/SeakMengs")}>@Seakmeng</Anchor>
            </Text>
            <Text display={"flex"}>{t("Source code:")}
                <Anchor mx={"xs"} onClick={() => open("https://github.com/SeakMengs/WindowPet")}>@SeakMengs/WindowPet</Anchor>
            </Text>
            <Text display={"flex"}>{t("Buy me a coffee:")}
                <Anchor mx={"xs"} onClick={() => open("https://www.buymeacoffee.com/seakmeng")}>BuyMeACoffee/@Seakmeng</Anchor>
            </Text>
        </Flex>
    )
}

export default memo(About);