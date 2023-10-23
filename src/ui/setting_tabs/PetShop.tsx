import { Box } from "@mantine/core";
import { memo, useCallback, useMemo } from "react";
import PetCard from "../components/PetCard";
import { useTranslation } from "react-i18next";
import { ISpriteConfig } from "../../types/ISpriteConfig";
import { getAppSettings, setConfig } from "../../utils/settings";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { PrimaryColor } from "../../utils";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { PetCardType } from "../../types/components/type";
import { useSettingStore } from "../../hooks/useSettingStore";
import { DispatchType } from "../../types/IEvents";
import { ColorSchemeType } from "../../types/ISetting";

function PetShop() {
    const { setPets, defaultPet, theme: colorScheme } = useSettingStore();
    const { t } = useTranslation();

    const addPetToConfig = useCallback(async (index: number) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        userPetConfig.push(defaultPet[index]);
        userPetConfig[userPetConfig.length - 1].id = crypto.randomUUID();

        setConfig({ configName: "pets.json", newConfig: userPetConfig });
        setPets(userPetConfig);

        notifications.show({
            message: t("pet name has been added to your realm", { name: defaultPet[index].name }),
            title: t("Pet Added"),
            color: PrimaryColor,
            icon: <IconCheck size="1rem" />,
            withBorder: true,
            autoClose: 800,
            style: (theme) => ({
                backgroundColor: colorScheme === ColorSchemeType.Dark ? theme.colors.dark[7] : theme.colors.gray[0],
            })
        })

        // update pet window to show new pet
        handleSettingChange(DispatchType.AddPet, defaultPet[index]);
    }, [t]);

    const PetCards = useMemo(() => {
        return defaultPet.map((pet: ISpriteConfig, index: number) => {
            return <PetCard key={index} pet={pet} btnLabel={t("Acquire")} type={PetCardType.Add} btnFunction={() => addPetToConfig(index)} />
        })
    }, [t]);

    return (
        <>
            <Box style={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                {PetCards}
            </Box>
        </>
    )
}

export default memo(PetShop);