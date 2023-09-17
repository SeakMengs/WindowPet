import { UpdaterPopupProps } from "../../types/components/type"
import { Anchor, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/api/shell";

function Updater({ shouldUpdate, manifest }: UpdaterPopupProps) {
    const { t } = useTranslation();
    return (
        <>
            <Text display={"inline"}>{t("WindowPet v available, do you want to install the update?", { version: manifest?.version })}
                <Anchor mx={"xs"} onClick={() => open(`https://github.com/SeakMengs/WindowPet/releases/latest`)}>{t("(release note)")}</Anchor>
            </Text>
        </>
    )
}

export default Updater;