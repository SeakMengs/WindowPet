import { Box } from "@mantine/core";
import { memo, useCallback, useMemo } from "react";
import PetCard from "../components/PetCard";
import { useTranslation } from "react-i18next";
import { ISpriteConfig } from "../../types/ISpriteConfig";
import { getAppSettings } from "../../utils/settings";
import { invoke } from "@tauri-apps/api";
import { Store } from "tauri-plugin-store-api";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { PrimaryColor } from "../../utils";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { PetCardType } from "../../types/components/type";
import { useSettingStore } from "../../hooks/useSettingStore";

function PetShop({ scrollToTop }: { scrollToTop: () => void; }) {
    const { setPets, defaultPet } = useSettingStore();
    const { t } = useTranslation();

    const addPetToConfig = useCallback(async (index: number) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        userPetConfig.push(defaultPet[index]);

        const configPath: string = await invoke("combine_config_path", { config_name: "pets.json" });
        const store = new Store(configPath);
        await store.set('app', userPetConfig);
        await store.save();

        // update pets in state
        setPets(userPetConfig);

        notifications.show({
            message: t("pet name has been added to your realm", { name: defaultPet[index].name }),
            title: t("Pet Added"),
            color: PrimaryColor,
            icon: <IconCheck size="1rem" />,
            withBorder: true,
            autoClose: 800,
            sx: (theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
            })
        })

        // update pet window to show new pet
        handleSettingChange('addPet', defaultPet[index]);
    }, []);

    const PetCards = useMemo(() => {
        return defaultPet.map((pet: ISpriteConfig, index: number) => {
            return <PetCard key={index} pet={pet} btnLabel={t("Acquire")} type={PetCardType.Add} btnFunction={() => addPetToConfig(index)} />
        })
    }, [addPetToConfig, t]);

    return (
        <>
            <Box sx={{
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