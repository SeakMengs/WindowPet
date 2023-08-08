import { Group, Switch, Flex } from "@mantine/core";

function AddPet() {
    return (
        <Switch.Group
            defaultValue={['react']}
            label="Select your favorite framework/library"
            description="This is anonymous"
            withAsterisk
        >
            <Flex direction={{ base: 'column' }} mt={'xs'}>
                <Switch mt={'xs'} value="react" label="React" />
                <Switch mt={'xs'} value="svelte" label="Svelte" />
                <Switch mt={'xs'} value="ng" label="Angular" />
                <Switch mt={'xs'} value="vue" label="Vue" />
            </Flex>
        </Switch.Group>
    )
}

export default AddPet;