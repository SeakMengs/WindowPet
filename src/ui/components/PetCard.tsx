import { Box, Button, Select, Title } from "@mantine/core";
import { memo, useState } from "react";
import { IPetCardProps } from "../../types/components/type";
import PhaserCanvas from "./PhaserCanvas";
import { useInView } from "react-intersection-observer";
import { CanvasSize } from "../../utils";

function PetCard({ btnLabel, pet, btnFunction }: IPetCardProps) {
    const [playState, setPlayState] = useState<string>(pet.states['idle'] ? 'idle' : Object.keys(pet.states)[0]);
    const { ref, inView } = useInView();

    return (
        <Box ref={ref} sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            maxWidth: '14rem',
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.md,
            border: `0.0625rem solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        })}>
            {/* if the pet is currently in user viewport, show it, otherwise destroy it dom because it take a lot of resource */}
            {inView ?
                <PhaserCanvas pet={pet} playState={playState} /> :
                <div className="" style={{
                    height: CanvasSize,
                    width: CanvasSize,
                }}>
                </div>
            }
            <Box sx={(theme) => ({
                padding: theme.spacing.lg,
            })}>
                <Title order={4} align="center">{pet.name}</Title>
                <Select
                    my={"md"}
                    maxDropdownHeight={210}
                    placeholder="Pick one"
                    defaultValue={playState}
                    data={Object.keys(pet.states).map(state => ({ value: state, label: state, })
                    )}
                    onChange={setPlayState as any}
                />
                <Button variant="outline" fullWidth onClick={btnFunction}>
                    {btnLabel}
                </Button>
            </Box>
        </Box>
    )
};

export default memo(PetCard);