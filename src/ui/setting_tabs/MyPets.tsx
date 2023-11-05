import { memo, useCallback, useMemo } from "react";
import PetCard from "../components/PetCard";
import { Box } from "@mantine/core";
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

export function MyPets() {
    const { refetch } = usePets();
    const { t } = useTranslation();
    const { theme: colorScheme, pets, setPets } = useSettingStore();

    const removePet = useCallback(async (petId: string) => {
        const userPetConfig = await getAppSettings({ configName: "pets.json" });
        let removedPetName;
        const newConfig = userPetConfig.filter((pet: ISpriteConfig) => {
            if (pet.id === petId) removedPetName = pet.name;
            return pet.id !== petId;
        });

        setConfig({ configName: "pets.json", newConfig: newConfig });
        setPets(newConfig);

        // manually remove petCard dom to fix flickering problem
        const petCardDom = document.getElementById(`petCard-id-${petId}`);
        if (petCardDom) petCardDom.remove();

        if (newConfig.length === 0) noPetDialog();

        // update pet window to show new pet
        handleSettingChange(DispatchType.RemovePet, petId);

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

        refetch();
    }, [t]);

    // we don't put pets as dependency because it will cause flickering when we remove pet
    // so we manually remove petCard dom in removePet function
    const PetCards = useMemo(() => {
        return pets.map((pet: ISpriteConfig, index: number) => {
            return (
                <PetCard key={pet.id} pet={pet} btnLabel={t("Remove")} type={PetCardType.Remove} btnFunction={() => removePet(pet.id as string)} />
            );
        });
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
                <AddCard />
            </Box>
        </>
    );
}

export default memo(MyPets);