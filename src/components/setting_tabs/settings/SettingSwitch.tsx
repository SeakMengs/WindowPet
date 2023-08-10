import { Switch, Group, Text, Divider } from "@mantine/core";

interface SettingSwitchProps {
    title: string,
    description: string,
    checked: boolean,
    dispatchType: string;
    handleSettingChange: (dispatchType: string, value: any) => void;
}

function SettingSwitch({ title, description, checked = false, dispatchType, handleSettingChange }: SettingSwitchProps) {
    return (
        <>
            <Group position="apart">
                <div>
                    <Text >{title}</Text>
                    <Text fz={"xs"} c={"dimmed"}>
                        {description}
                    </Text>
                </div>
                <Switch size={"lg"} checked={checked} onChange={(event) => handleSettingChange(dispatchType, event.target.checked)} />
            </Group>
            <Divider my={"sm"} />
        </>
    )
}

export default SettingSwitch