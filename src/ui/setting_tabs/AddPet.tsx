import {
    Center,
    Group,
    NumberInput,
    Flex,
    Button,
    Accordion,
    Divider,
    Alert,
    TextInput,
} from "@mantine/core";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

function AddPet() {
    const { t } = useTranslation();

    return (<>
        <Flex direction={"column"}>
                <TextInput
                    mt="xl"
                    withAsterisk
                    label={t("Pet Name")}
                    placeholder={t("Pet Name")}
                    // value={currentPetName}
                    // onChange={(event) => {
                    //     setCurrentPetName(event.currentTarget.value);
                    // }}
                />
            </Flex>
    </>)
}

export default memo(AddPet);