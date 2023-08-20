import {
    Center,
    Group,
    createStyles,
    getStylesRef,
    Image,
    NumberInput,
    Flex,
    ScrollArea,
    Button,
} from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function AddPet() {
    const useStyles = createStyles(() => ({
        controls: {
            ref: getStylesRef('controls'),
            transition: 'opacity 150ms ease',
            opacity: 0,
        },

        root: {
            '&:hover': {
                [`& .${getStylesRef('controls')}`]: {
                    opacity: 1,
                },
            },
        },
    }));
    const { t, i18n } = useTranslation();
    const [selectedPet, setSelectedPet] = useState<number>(0);

    useEffect(() => {
        console.log(selectedPet);
    }, [selectedPet]);

    return (
        <>
            <ScrollArea style={{
                height: "100vh"
            }}>
                <Center>
                    <Carousel
                        maw={320}
                        mx="auto"
                        height={200}
                        styles={{
                            control: {
                                '&[data-inactive]': {
                                    opacity: 0,
                                    cursor: 'default',
                                },
                            },
                        }}
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
                <Center>
                    <Flex direction={"column"}>
                        <Group spacing={"xl"}>
                            <NumberInput
                                mt="xl"
                                label="NumberInput with custom layout"
                                placeholder="NumberInput with custom layout"
                                description="Description below the input"
                            />
                            <NumberInput
                                mt="xl"
                                label="NumberInput with custom layout"
                                placeholder="NumberInput with custom layout"
                                description="Description below the input"
                            />
                        </Group>
                        <Group spacing={"xl"}>
                            <NumberInput
                                mt="xl"
                                label="NumberInput with custom layout"
                                placeholder="NumberInput with custom layout"
                                description="Description below the input"
                            />
                            <NumberInput
                                mt="xl"
                                label="NumberInput with custom layout"
                                placeholder="NumberInput with custom layout"
                                description="Description below the input"
                            />
                        </Group>
                        <Group spacing={"xl"}>
                            <NumberInput
                                mt="xl"
                                label="NumberInput with custom layout"
                                placeholder="NumberInput with custom layout"
                                description="Description below the input"
                            />
                            <NumberInput
                                mt="xl"
                                label="NumberInput with custom layout"
                                placeholder="NumberInput with custom layout"
                                description="Description below the input"
                            />
                        </Group>
                        <Group position={"right"} my="xl">
                            <Button color="green">
                                {t("Apply")}
                            </Button>
                            <Button color="red">
                                {t("Cancel")}
                            </Button>
                        </Group>
                    </Flex>
                </Center>
            </ScrollArea>
        </>
    )
}

export default AddPet;