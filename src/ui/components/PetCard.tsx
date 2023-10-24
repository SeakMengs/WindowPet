import { Box, Button, NativeSelect, Select, Title } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { IPetCardProps } from "../../types/components/type";
import PhaserCanvas from "./PhaserCanvas";
import { useInView } from "react-intersection-observer";
import { ButtonVariant, CanvasSize } from "../../utils";
import classes from './PetCard.module.css';
import { usePetStateStore } from "../../hooks/usePetStateStore";

function PetCard({ btnLabel, pet, btnFunction, type }: IPetCardProps) {
    const { petStates, storeDictPetStates } = usePetStateStore();
    const availableStates = petStates[pet.name] ?? Object.keys(pet.states).map(state => (state));
    const randomState = availableStates[Math.floor(Math.random() * availableStates.length)];
    const [playState, setPlayState] = useState<string>(randomState);
    const { ref, inView } = useInView();

    // save pet to memoization so that we can use it later to save some resource
    useEffect(() => {
        if (!petStates.hasOwnProperty(pet.name)) {
            storeDictPetStates(pet.name, availableStates);
        }
    }, []);

    return (
        <>
            {/* if the pet is currently in user viewport, show it, otherwise destroy its dom because it take a lot of resource */}
            <Box id={`petCard-id-${pet.id}`} ref={ref} className={classes.boxWrapper} key={pet.id ?? pet.name}>
                {inView ?
                    <Box>
                        <PhaserCanvas pet={pet} playState={playState} key={pet.id} />
                        <Box p={"lg"}>
                            <Title order={4} className={classes.title}>{pet.name}</Title>
                            {/* for now use native select because select in mantine 7 is very slow, let see until further update */}
                            {/* <Select
                                allowDeselect={false}
                                checkIconPosition={"right"}
                                my={"md"}
                                maxDropdownHeight={210}
                                placeholder="Pick one"
                                defaultValue={playState}
                                onChange={setPlayState as any}
                                pointer
                                key={pet.id ?? pet.name}
                                data={availableStates}
                            /> */}
                            <NativeSelect
                                my={"md"}
                                placeholder="Pick one"
                                defaultValue={playState}
                                onChange={(event) => setPlayState(event.currentTarget.value)}
                                pointer
                                key={pet.id ?? pet.name}
                                data={availableStates}
                            />
                            <Button variant={ButtonVariant} fullWidth onClick={btnFunction}>
                                {btnLabel}
                            </Button>
                        </Box>
                    </Box>
                    :
                    <Box style={{
                        height: CanvasSize,
                        width: CanvasSize,
                    }}>
                    </Box>
                }
            </Box >
        </>
    )
};

export default memo(PetCard);