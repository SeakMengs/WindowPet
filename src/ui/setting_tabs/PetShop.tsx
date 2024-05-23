import { Box, TextInput } from "@mantine/core";
import { memo, useCallback, useMemo, useState } from "react";
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
import { ColorSchemeType, DefaultConfigName } from "../../types/ISetting";
import { invoke } from "@tauri-apps/api";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useDefaultPets } from "../../hooks/usePets";

function PetShop() {
    const { refetch } = useDefaultPets();
    const { setPets, defaultPet, theme: colorScheme } = useSettingStore();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");

    const addPetToConfig = useCallback(async (pet: ISpriteConfig) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        userPetConfig.push({ ...pet, id: crypto.randomUUID() });

        setConfig({ configName: "pets.json", newConfig: userPetConfig });
        setPets(userPetConfig);

        if (!WebviewWindow.getByLabel('main')) await invoke("reopen_main_window");

        notifications.show({
            message: t("pet name has been added to your realm", { name: pet.name }),
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
        handleSettingChange(DispatchType.AddPet, pet);
    }, [t]);

    const removeCustomPet = useCallback(async (pet: ISpriteConfig) => {
        const petLinker = await getAppSettings({ configName: DefaultConfigName.PET_LINKER });

        if (!petLinker) return;

        // remove custom pet from linker
        const newPetLinker = petLinker.filter((p: ISpriteConfig) => p.name === pet.name);
        setConfig({ configName: DefaultConfigName.PET_LINKER, newConfig: newPetLinker });

        notifications.show({
            message: t("pet name has been removed from your realm", { name: pet.name }),
            title: t("Pet Removed"),
            color: PrimaryColor,
            icon: <IconCheck size="1rem" />,
            withBorder: true,
            autoClose: 800,
            style: (theme) => ({
                backgroundColor: colorScheme === ColorSchemeType.Dark ? theme.colors.dark[7] : theme.colors.gray[0],
            })
        });

        const petCardDom = document.getElementById(`petCard-id-${pet.customId}`);
        if (petCardDom) petCardDom.remove();
        refetch();
    }, [t]);

    const filteredPets = useMemo(() => {
        return defaultPet.filter(pet =>
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, defaultPet]);

    const PetCards = useMemo(() => {
        return filteredPets.map((pet: ISpriteConfig, index: number) => {
            return <PetCard key={index} pet={pet} btnLabel={t("Acquire")} type={PetCardType.Add} btnFunction={() => addPetToConfig(pet)} btnLabelCustom={t("Remove")} btnFunctionCustom={() => removeCustomPet(pet)} />
        });
    }, [t, filteredPets, addPetToConfig, removeCustomPet]);

    return (
        <>
            <TextInput
                placeholder={t("Search for pets")}
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
            </Box>
        </>
    )
}

export default memo(PetShop);