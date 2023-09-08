import { Box, Button, Image, Select, Title } from "@mantine/core";
import { memo } from "react";
import { IPetCardProps } from "../../types/components/type";
import { primaryColor } from "../../utils";


function PetCard({ btnLabel, pet, btnFunction } : IPetCardProps ) {

    return (
        <>
            <Box sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                maxWidth: '14rem',
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
                border: `0.0625rem solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            })}>
                <Image
                    sx={(theme) => ({
                        borderRadius: theme.radius.md,
                    })}
                    src={"https://freepngimg.com/save/125360-anime-free-transparent-image-hq/500x500"}
                    height={'14rem'}
                    width={'14rem'}
                    alt="Pet Image"
                />
                <Box sx={(theme) => ({
                    padding: theme.spacing.lg,
                })}>
                    <Title order={4} align="center">{pet.name}</Title>
                    <Select
                        my={"md"}
                        maxDropdownHeight={210}
                        placeholder="Pick one"
                        // make default value idle, if idle doesn't exist choose state at index 0
                        defaultValue={
                            pet.states['idle'] ? 'idle' : Object.keys(pet.states)[0]
                        }
                        data={Object.keys(pet.states).map(state => ({value: state, label: state,})
                        )}
                    />
                    <Button variant="light" fullWidth radius="md" onClick={btnFunction}>
                        {btnLabel}
                    </Button>
                </Box>
            </Box>
        </>
    )
};

export default memo(PetCard);