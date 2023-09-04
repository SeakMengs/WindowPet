import { Box } from "@mantine/core";
import { memo } from "react";
import PetCard from "../components/PetCard";
import { useTranslation } from "react-i18next";

function PetShop() {
    const { t } = useTranslation();

    return (
        <>
            <Box sx={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
                <PetCard btnLabel={t("Acquire")} />
            </Box>
        </>
    )
}

export default memo(PetShop);