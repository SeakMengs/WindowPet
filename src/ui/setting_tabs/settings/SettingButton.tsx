import { Group, Text, Divider, Button } from "@mantine/core";
import { SettingButtonProps } from "../../../types/components/type";
import { ButtonVariant } from "../../../utils";

function SettingButton({ title, description, btnLabel, btnFunction}: SettingButtonProps) {
    return (
        <>
            <Group justify={"space-between"}>
                <div>
                    <Text >{title}</Text>
                    <Text maw={460} fz={"xs"} c={"dimmed"} >
                        {description}
                    </Text>
                </div>
                <Button variant={ButtonVariant} onClick={btnFunction}>{btnLabel}</Button>
            </Group>
            <Divider my={"sm"} />
        </>
    )
}

export default SettingButton