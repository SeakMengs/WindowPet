import { memo, useEffect, useMemo, useState } from "react";
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

        return () => {
            setAppVersion('.....');
            setCheckingForUpdate(false);
            setIsLatestVersion(false);
        }
    }, []);

    const titleAndLinks = useMemo(() => ([
        {
            title: t("Developed by:"),
            link: {
                url: "https://github.com/SeakMengs",
                label: t("@Seakmeng"),
            },
        },
        {
            title: t("Source code:"),
            link: {
                url: "https://github.com/SeakMengs/WindowPet",
                label: t("@SeakMengs/WindowPet"),
            },
        },
        {
            title: t("Report a bug:"),
            link: {
                url: "https://github.com/SeakMengs/WindowPet/issues",
                label: t("@SeakMengs/WindowPet/issues"),
            },
        },
        {
            title: t("Community: "),
            link: {
                url: "https://github.com/SeakMengs/WindowPet/discussions",
                label: t("@SeakMengs/WindowPet/discussions"),
            },
        },
        {
            title: t("Buy me a coffee:"),
            link: {
                url: "https://www.buymeacoffee.com/seakmeng",
                label: t("BuyMeACoffee/@Seakmeng"),
            },
        },
    ]), []);

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
            {
                titleAndLinks.map((item, index) => (
                    <Text key={`titleAndLinks-${index}`} display={"flex"}>
                        {item.title}
                        <Anchor mx={"xs"} onClick={() => open(item.link.url)}>{item.link.label}</Anchor>
                    </Text>
                ))
            }
        </Flex>
    )
}

export default memo(About);