import { Box, Flex, Text } from "@mantine/core";
import { ITitleProps } from "../../types/components/type";

function Title({ title, description }: ITitleProps) {
    return (
        <Flex gap={"lg"}>
            <Box w={5} h={50} sx={(theme) => ({
                backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
                '&:hover': {
                    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).hover
                },
            })} />
            <Box>
                <Text fz={"lg"} fw={500}>{title}</Text>
                <Text fz={"xs"} c={"dimmed"} mt={3} mb={"xl"}>
                    {description}
                </Text>
            </Box>
        </Flex>
    )
}

export default Title;