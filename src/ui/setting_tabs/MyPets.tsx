import { memo, useCallback, useMemo } from "react";
import PetCard from "../components/PetCard";
import { Box } from "@mantine/core";
import AddCard from "./my_pets/AddCard";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "../../hooks/useSettingStore";
import { ISpriteConfig } from "../../types/ISpriteConfig";
import { getAppSettings } from "../../utils/settings";
import { invoke } from "@tauri-apps/api";
import { Store } from "tauri-plugin-store-api";
import { notifications } from "@mantine/notifications";
import { PrimaryColor, noPetDialog } from "../../utils";
import { IconCheck } from "@tabler/icons-react";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { PetCardType } from "../../types/components/type";
import { DispatchType } from "../../types/IEvents";

export function MyPets() {
    const { t } = useTranslation();
    const { pets, setPets } = useSettingStore();

    const removePet = useCallback(async (index: number) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        // 2nd parameter means remove one item only
        userPetConfig.splice(index, 1);

        const configPath: string = await invoke("combine_config_path", { config_name: "pets.json" });
        const store = new Store(configPath);
        await store.set('app', userPetConfig);
        await store.save();

        // update pets state
        setPets(userPetConfig);

        if (userPetConfig.length === 0) noPetDialog();

        notifications.show({
            message: t("pet name has been removed", { name: pets[index].name }),
            title: t("Pet Removed"),
            color: PrimaryColor,
            icon: <IconCheck size="1rem" />,
            withBorder: true,
            autoClose: 800,
            sx: (theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
            })
        });

        // update pet window to show new pet
        handleSettingChange(DispatchType.RemovePet, index);
    }, [pets]);

    const PetCards = useMemo(() => {
        return pets.map((pet: ISpriteConfig, index: number) => {
            return (
                <PetCard key={index} pet={pet} btnLabel={t("Remove")} type={PetCardType.Remove} btnFunction={() => removePet(index)} />
            );
        });
    }, [pets, removePet, t]);

    return (
        <>
            <Box sx={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                {PetCards}
                <AddCard/>
            </Box>
        </>
    );
}

export default memo(MyPets);