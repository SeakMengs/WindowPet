import { Switch, Flex, Select, Button, Group } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import { useEffect, useState } from "react";

const inputMarginTop = 'sm';

const languages = [
    {
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
        label: 'English',
        value: 'en',
    },
    {
        image: 'https://cdn.britannica.com/27/4027-004-B57F84E9/Flag-Cambodia.jpg',
        label: 'Khmer',
        value: 'kh',
    },
];

function Settings() {
    const [language, setLanguage] = useState<string | null>('en');

    useEffect(() => {
        console.log(language)
    }, [language]);

    return (
        <>
            <Flex direction={{ base: 'column' }}>
                <Switch.Group
                    defaultValue={['petOnTopTaskBar']}
                    label="Settings preferences"
                    withAsterisk
                >
                    <Switch mt={inputMarginTop} value="petOnTopTaskBar" label="Pet on top of taskbar" />
                    <Switch mt={inputMarginTop} value="2" label="Start on window start up" />
                </Switch.Group>

                <Select
                    sx={{
                        maxWidth: 300,
                    }}
                    mt={inputMarginTop}
                    label="Language"
                    placeholder="Pick one"
                    itemComponent={SelectItem}
                    data={languages}
                    maxDropdownHeight={400}
                    value={language}
                    onChange={setLanguage}
                />
            </Flex>
            <Group mt={inputMarginTop}>
                <Button color="green">
                    Apply
                </Button>
                <Button color="red">
                    Cancel
                </Button>
            </Group>
        </>
    )
}

export default Settings;