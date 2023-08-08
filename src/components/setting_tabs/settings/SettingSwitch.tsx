import { Switch, Group, Text, Divider } from "@mantine/core";

interface SettingSwitchProps {
    title: string,
    description: string,
}

function SettingSwitch({ title, description }: SettingSwitchProps) {

    return (
        <>
            <Group position="apart">
                <div>
                    <Text >{title}</Text>
                    <Text fz={"xs"} c={"dimmed"}>
                        {description}
                    </Text>
                </div>
                <Switch size={"lg"} onLabel="ON" offLabel="OFF" />
            </Group>
            <Divider my={"sm"}/>
        </>
    )
}

export default SettingSwitch