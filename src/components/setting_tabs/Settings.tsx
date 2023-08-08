import { Select, Button, Group, Text, createStyles } from "@mantine/core";
import { SelectItem } from "./settings/SelectItem";
import { useEffect, useState } from "react";
import languages from "../../locale/languages";
import SettingSwitch from "./settings/SettingSwitch";

interface dataProps {
    parent: {
        title: string;
        description: string;
    };
    child: {
        title: string;
        description: string;
    }[];
}

function Settings() {

    const [language, setLanguage] = useState<string | null>('en');

    const data: dataProps = {
        parent: {
            title: "Setting preferences",
            description: "Choose what u desire, do what u love"
        },
        child: [
            {
                title: "Messages",
                description: "Direct messages you have received from other users"
            },
            {
                title: "Review requests",
                description: "Code review requests from your team members"
            },
            {
                title: "Comments",
                description: "Daily digest with comments on your posts"
            },
            {
                title: "Recommendations",
                description: "Digest with best community posts from previous week"
            }
        ]
    }

    const settingSwitches = data.child.map((data, index) => {
        return <SettingSwitch {...data} key={index} />
    })

    return (
        <>
            <Text fz={"lg"} fw={500}>{data.parent.title}</Text>
            <Text fz={"xs"} c={"dimmed"} mt={3} mb={"xl"}>
                {data.parent.description}
            </Text>
            {settingSwitches}
            <Select
                my={"sm"}
                label="Language"
                placeholder="Pick one"
                itemComponent={SelectItem}
                data={languages}
                maxDropdownHeight={400}
                value={language}
                onChange={setLanguage}
            />
            <Group position={"right"}>
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