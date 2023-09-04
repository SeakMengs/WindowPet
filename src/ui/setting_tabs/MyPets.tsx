import { memo } from "react";
import PetCard from "../components/PetCard";
import { Box } from "@mantine/core";
import AddCard from "./my_pets/AddCard";
import { useTranslation } from "react-i18next";

function MyPets({ scrollToTop }: { scrollToTop: () => void }) {
    const { t } = useTranslation();

    return (
        <>
            <Box sx={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <PetCard btnLabel={t("Remove")} />
                <AddCard scrollToTop={scrollToTop} />
            </Box>
        </>
    )
}

export default memo(MyPets);