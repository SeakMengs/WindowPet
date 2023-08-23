import {
    Center,
    Group,
    Image,
    NumberInput,
    Flex,
    Button,
    Accordion,
    Divider,
    TextInput,
} from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { memo } from "react";

function AddPet() {
    const { t } = useTranslation();
    const [selectedPet, setSelectedPet] = useState<number>(0);

    console.log("AddPet render time");

    return (
        <>
            <Center>
                <Carousel
                    maw={320}
                    mx="auto"
                    height={200}
                    loop
                    initialSlide={selectedPet}
                    onSlideChange={(index) => setSelectedPet(index)}
                >
                    <Carousel.Slide>
                        <Image src={"https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQkrjYxSfSHeCEA7hkPy8e2JphDsfFHZVKqx-3t37E4XKr-AT7DML8IwtwY0TnZsUcQ"} />
                    </Carousel.Slide>
                    <Carousel.Slide>
                        <Image src={"https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg"} />
                    </Carousel.Slide>
                </Carousel>
            </Center>
            <Flex direction={"column"}>
                <TextInput
                    mt="xl"
                    withAsterisk
                    label={t("Pet Name")}
                    placeholder={t("Pet Name")}
                />
                <Group spacing={"xl"} grow>
                    <NumberInput
                        mt="xl"
                        withAsterisk
                        label={t("Position Y")}
                        placeholder={t("Position Y")}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    />
                    <NumberInput
                        mt="xl"
                        withAsterisk
                        label={t("Scale")}
                        placeholder={t("Scale")}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    />
                </Group>
                <Group spacing={"xl"} grow>
                    <NumberInput
                        mt="xl"
                        withAsterisk
                        label={t("Walk speed")}
                        placeholder={t("Walk speed")}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    />
                    <NumberInput
                        mt="xl"
                        withAsterisk
                        label={t("Run speed")}
                        placeholder={t("Run speed")}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    />
                </Group>
                <Divider label={t("Pet States")} labelPosition="center" my={"xl"} />
                <Accordion variant="separated">
                    <Accordion.Item value="idle">
                        <Accordion.Control>Idle</Accordion.Control>
                        <Accordion.Panel>
                            <NumberInput
                                withAsterisk
                                label={t("Animate duration")}
                                placeholder={t("Animate duration")}
                                description={t("It is the time it takes for an animation to complete one cycle. If the animate duration exceeds the default animation time, it will reset to the default animation and repeat")}
                                stepHoldDelay={500}
                                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                            />
                            <NumberInput
                                my="xl"
                                withAsterisk
                                label={t("Animation speed")}
                                placeholder={t("Animation speed")}
                                stepHoldDelay={500}
                                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                <Group position={"right"} my="xl">
                    <Button color="green">
                        {t("Apply")}
                    </Button>
                    <Button color="red">
                        {t("Cancel")}
                    </Button>
                </Group>
            </Flex>
        </>
    )
}

export default memo(AddPet);