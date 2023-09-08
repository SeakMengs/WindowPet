import { memo, useCallback } from "react";
import PetCard from "../components/PetCard";
import { Box } from "@mantine/core";
import AddCard from "./my_pets/AddCard";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "../../hooks/useSettingStore";
import { ISpriteConfig } from "../../types/ISpriteConfig";
import { getAppSettings } from "../../utils/settings";
import { invoke } from "@tauri-apps/api";
import { Store } from "tauri-plugin-store-api";
import { usePets } from "../../hooks/usePets";
import { notifications } from "@mantine/notifications";
import { primaryColor } from "../../utils";
import { IconCheck } from "@tabler/icons-react";

function MyPets({ scrollToTop }: { scrollToTop: () => void }) {
    const { t } = useTranslation();
    const { pets } = useSettingStore();
    const { refetch } = usePets();

    const removePet = useCallback(async (index: number) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        // 2nd parameter means remove one item only
        userPetConfig.splice(index, 1);

        const configPath: string = await invoke("combine_config_path", { config_name: "pets.json" });
        const store = new Store(configPath);
        await store.set('app', userPetConfig);
        await store.save();
        refetch();

        notifications.show({
            message: t("pet name has been removed", { name: pets[index].name }),
            title: t("Pet Removed"),
            color: primaryColor,
            icon: <IconCheck size="1rem" />,
            withBorder: true,
            sx: (theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
            })
        })

    }, [pets, refetch]);

    return (
        <>
            <Box sx={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                {
                    pets.map((pet: ISpriteConfig, index: number) => {
                        return (
                            <PetCard key={index} pet={pet} btnLabel={t("Remove")} btnFunction={() => removePet(index)} />
                        )
                    })
                }
                <AddCard scrollToTop={scrollToTop} />
            </Box>
        </>
    )
}

export default memo(MyPets);