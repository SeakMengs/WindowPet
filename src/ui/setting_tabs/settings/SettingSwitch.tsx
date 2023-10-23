import { Switch, Group, Text, Divider, Slider } from "@mantine/core";
import { handleSettingChange } from "../../../utils/handleSettingChange";
import { SettingSwitchProps } from "../../../types/components/type";

function SettingSwitch({ title, description, checked = false, dispatchType, component }: SettingSwitchProps) {
    return (
        <>
            <Group justify={"space-between"}>
                <div>
                    <Text >{title}</Text>
                    <Text maw={460} fz={"xs"} c={"dimmed"} >
                        {description}
                    </Text>
                </div>
                <Switch size={"lg"} checked={checked} onChange={(event) => handleSettingChange(dispatchType, event.target.checked)} />
            </Group>
            {component}
            <Divider my={"sm"} />
        </>
    )
}

export default SettingSwitch