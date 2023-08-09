import { Switch, Group, Text, Divider } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

interface SettingSwitchProps {
    title: string,
    description: string,
    checked: boolean,
    setCheck: Dispatch<SetStateAction<boolean>>;
}

function SettingSwitch({ title, description, checked = false, setCheck }: SettingSwitchProps) {

    return (
        <>
            <Group position="apart">
                <div>
                    <Text >{title}</Text>
                    <Text fz={"xs"} c={"dimmed"}>
                        {description}
                    </Text>
                </div>
                <Switch size={"lg"} checked={checked} onChange={(event) => setCheck(event.target.checked)}  />
            </Group>
            <Divider my={"sm"} />
        </>
    )
}

export default SettingSwitch