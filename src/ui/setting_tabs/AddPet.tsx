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
import { Carousel } from '@mantine/carousel';
import { useTranslation } from "react-i18next";
import { memo, useEffect, useState } from "react";
import StateInput from "./add_pet/StateInput";
import PetSlide from "./add_pet/PetSlide";
import { IconAlertCircle } from '@tabler/icons-react';

function AddPet() {
    // const { t } = useTranslation();
    // const [selectedPetIndex, setSelectedPetIndex] = useState<number>(0);
    // const [currentPet, setCurrentPet] = useState(defaultPetOptions[selectedPetIndex]);
    // const [currentPetName, setCurrentPetName] = useState<string>(currentPet.name);

    // const PetOptionImages = defaultPetOptions.map((pet, index) => {
    //     const imageSrc = pet.states[Object.keys(currentPet.states)[0]]?.imageSrc;
    //     return <PetSlide imageSrc={imageSrc} key={index} />
    // });

    // useEffect(() => {
    //     setCurrentPet(defaultPetOptions[selectedPetIndex]);
    //     setCurrentPetName(defaultPetOptions[selectedPetIndex].name);
    // }, [selectedPetIndex]);

    // const CurrentPetStateInputs: any = Object.keys(currentPet.states).map((state, index) => {
    //     return <StateInput framesHold={currentPet.states[state]?.framesHold} stateHold={currentPet.states[state]?.stateHold} state={state} key={index} exclude={index === 2 ? true : false}/>;
    // });

    // return (
    //     <>
    //         <Center>
    //             <Carousel
    //                 maw={320}
    //                 mx="auto"
    //                 height={200}
    //                 loop
    //                 initialSlide={selectedPetIndex}
    //                 onSlideChange={(index) => setSelectedPetIndex(index)}
    //             >
    //                 {PetOptionImages}
    //             </Carousel>
    //         </Center>
    //         <Flex direction={"column"}>
    //             <Alert icon={<IconAlertCircle size="1rem" />} title={t("Attention")} variant="outline">
    //                 {t("We have already tested and fine-tuned the default pet configuration to provide the best user experience. You only need to change the name of your pet. Making other changes to the configuration may prevent you from seeing your pet after adding it")}
    //             </Alert>
    //             <TextInput
    //                 mt="xl"
    //                 withAsterisk
    //                 label={t("Pet Name")}
    //                 placeholder={t("Pet Name")}
    //                 value={currentPetName}
    //                 onChange={(event) => {
    //                     setCurrentPetName(event.currentTarget.value);
    //                 }}
    //             />
    //             <Group spacing={"xl"} grow>
    //                 <NumberInput
    //                     mt="xl"
    //                     withAsterisk
    //                     precision={2}
    //                     label={t("Position Y")}
    //                     placeholder={t("Position Y")}
    //                     stepHoldDelay={500}
    //                     stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
    //                     value={currentPet.position.y}
    //                 />
    //                 <NumberInput
    //                     mt="xl"
    //                     withAsterisk
    //                     precision={2}
    //                     label={t("Scale")}
    //                     placeholder={t("Scale")}
    //                     stepHoldDelay={500}
    //                     stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
    //                     value={currentPet.scale}
    //                     min={1}
    //                 />
    //             </Group>
    //             <Group spacing={"xl"} grow>
    //                 <NumberInput
    //                     mt="xl"
    //                     withAsterisk
    //                     precision={2}
    //                     label={t("Walk speed")}
    //                     placeholder={t("Walk speed")}
    //                     stepHoldDelay={500}
    //                     stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
    //                     value={currentPet.walkSpeed}
    //                     min={0}
    //                 />
    //                 <NumberInput
    //                     mt="xl"
    //                     withAsterisk
    //                     precision={2}
    //                     label={t("Run speed")}
    //                     placeholder={t("Run speed")}
    //                     stepHoldDelay={500}
    //                     stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
    //                     value={currentPet.runSpeed}
    //                     min={0}
    //                 />
    //             </Group>
    //             <Divider label={t("Pet States")} labelPosition="center" my={"xl"} />
    //             <Accordion variant="separated">
    //                 {CurrentPetStateInputs}
    //             </Accordion>
    //             <Group position={"right"} my="xl">
    //                 <Button color="green" variant="outline">
    //                     {t("Apply")}
    //                 </Button>
    //                 <Button color="red" variant="outline">
    //                     {t("Cancel")}
    //                 </Button>
    //             </Group>
    //         </Flex>
    //     </>
    // )

    return (<>
        <h1>Temporarily rework on this project</h1>
    </>)
}

export default memo(AddPet);