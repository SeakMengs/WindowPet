import { memo } from "react";
import PetCard from "./my_pets/PetCard";
import { Box } from "@mantine/core";
import AddCard from "./my_pets/AddCard";

function MyPets() {

    return (
        <>
            <Box sx={{
                display: "grid",
                placeItems: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gridGap: "1rem",
            }}>
                <PetCard />
                <PetCard />
                <PetCard />
                <PetCard />
                <PetCard />
                <PetCard />
                <PetCard />
                <PetCard />
                <AddCard />
            </Box>
        </>
    )
}

export default memo(MyPets);