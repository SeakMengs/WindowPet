import { Switch, Group, Text, Divider } from "@mantine/core";
import { handleSettingChange } from "../../../utils/handleSettingChange";
import { SettingSwitchProps } from "../../../types/components/type";

function SettingSwitch({ title, description, checked = false, dispatchType }: SettingSwitchProps) {
    return (
        <>
            <Group position="apart">
                <div>
                    <Text >{title}</Text>
                    <Text maw={460} fz={"xs"} c={"dimmed"} >
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