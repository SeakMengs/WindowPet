import { Group, Text, Divider, Button } from "@mantine/core";
import { SettingButtonProps } from "../../../types/components/type";

function SettingButton({ title, description, btnLabel, btnFunction}: SettingButtonProps) {
    return (
        <>
            <Group position="apart">
                <div>
                    <Text >{title}</Text>
                    <Text maw={460} fz={"xs"} c={"dimmed"} >
                        {description}
                    </Text>
                </div>
                <Button variant="outline" onClick={btnFunction}>{btnLabel}</Button>
            </Group>
            <Divider my={"sm"} />
        </>
    )
}

export default SettingButton