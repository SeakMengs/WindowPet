import { memo, useCallback, useMemo, useState, useEffect } from "react";
import PetCard from "../components/PetCard";
import { Box, TextInput } from "@mantine/core";
import AddCard from "./my_pets/AddCard";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "../../hooks/useSettingStore";
import { ISpriteConfig } from "../../types/ISpriteConfig";
import { getAppSettings, setConfig } from "../../utils/settings";
import { notifications } from "@mantine/notifications";
import { PrimaryColor, noPetDialog } from "../../utils";
import { IconCheck } from "@tabler/icons-react";
import { handleSettingChange } from "../../utils/handleSettingChange";
import { PetCardType } from "../../types/components/type";
import { DispatchType } from "../../types/IEvents";
import { ColorSchemeType } from "../../types/ISetting";
import { usePets } from "../../hooks/usePets";
import { invoke } from "@tauri-apps/api";

export function MyPets() {
    const { refetch, data: initialPets = [] } = usePets();
    const { t } = useTranslation();
    const { theme: colorScheme, pets, setPets } = useSettingStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFirstRemoval, setIsFirstRemoval] = useState(true);

    const removePet = useCallback(async (petId: string) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        let removedPetName;
        const newConfig = userPetConfig.filter((pet: ISpriteConfig) => {
            if (pet.id === petId) removedPetName = pet.name;
            return pet.id !== petId;
        });

        await setConfig({ configName: "pets.json", newConfig: newConfig });
        setPets(newConfig);

        if (newConfig.length === 0) noPetDialog();

        handleSettingChange(DispatchType.RemovePet, petId);
        if (isFirstRemoval) {
            try {
                await invoke("reopen_main_window");
            } catch (error) {
                console.warn("Failed to reopen main window:", error);
            }
            setIsFirstRemoval(false);
        }

        notifications.show({
            message: t("pet name has been removed", { name: removedPetName }),
            title: t("Pet Removed"),
            color: PrimaryColor,
            icon: <IconCheck size="1rem" />,
            withBorder: true,
            autoClose: 800,
            style: (theme) => ({
                backgroundColor: colorScheme === ColorSchemeType.Dark ? theme.colors.dark[7] : theme.colors.gray[0],
            })
        });

        await refetch();
    }, [t, isFirstRemoval, setIsFirstRemoval]);

    const filteredPets = useMemo(() => {
        return pets.filter(pet =>
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, pets]);

    const PetCards = useMemo(() => {
        return filteredPets.map((pet: ISpriteConfig) => {
            return (
                <PetCard key={pet.id} pet={pet} btnLabel={t("Remove")} type={PetCardType.Remove} btnFunction={() => removePet(pet.id as string)} />
            );
        });
    }, [t, filteredPets, removePet]);

    return (
        <>
            <TextInput
                placeholder={t("Search for my pets")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ marginBottom: '1rem', marginLeft: '1rem', marginRight: '1rem' }}
            />
            <Box style={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                {PetCards}
                <AddCard />
            </Box>
        </>
    );
}

export default memo(MyPets);