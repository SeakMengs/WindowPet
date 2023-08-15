import { Text } from "@mantine/core";
import { usePetStore } from "../../hooks/usePetStore";
import { useEffect } from "react";

function EditPet() {
    const { pets, isPetsInitialized } = usePetStore((state) => ({
        pets: state.pets,
        isPetsInitialized: state.isPetsInitialized,
    }));

    useEffect(() => {
        console.log(pets);
        console.log(isPetsInitialized);
    }, [pets, isPetsInitialized]);

    return (
        <>
            <button onClick={() => console.log(pets, isPetsInitialized)}>b</button>
            <Text>Edit Pet</Text>
        </>
    )
}

export default EditPet;