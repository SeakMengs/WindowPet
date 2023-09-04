import { Box, Button, Card, Group, Image, Select } from "@mantine/core";
import { memo } from "react";

function PetCard() {

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
                    alt="Norway"
                />
                <Box sx={(theme) => ({
                    padding: theme.spacing.lg,
                })}>

                    <Select
                        my={"md"}
                        maxDropdownHeight={210}
                        placeholder="Pick one"
                        defaultValue={'react'}
                        // dropdownPosition="top"
                        data={[
                            { value: 'react', label: 'React' },
                            { value: 'ng', label: 'Angular' },
                            { value: 'svelte', label: 'Svelte' },
                            { value: 'vue', label: 'Vue' },
                            { value: 'riot', label: 'Riot' },
                            { value: 'ember', label: 'Ember' },
                            { value: 'aurelia', label: 'Aurelia' },
                            { value: 'meteor', label: 'Meteor' },
                            { value: 'backbone', label: 'Backbone' },
                            { value: 'preact', label: 'Preact' },
                        ]}
                    />
                    <Button variant="light" fullWidth radius="md">
                        Remove
                    </Button>
                </Box>
            </Box>
        </>
    )
};

export default memo(PetCard);