import {
    TextInput,
    Fieldset,
    Stack,
    Tooltip,
    ActionIcon,
    Accordion,
    NumberInput,
    Text,
    Group,
    Button,
} from "@mantine/core";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonVariant, PrimaryColor } from "../../utils";
import { IconCheck, IconExclamationCircle, IconFolderOpen, IconPlus, IconTrash } from "@tabler/icons-react";
import { open } from "@tauri-apps/api/dialog";
import classes from './AddPet.module.css';
import clsx from "clsx";
import { exists } from "@tauri-apps/api/fs";
import { notifications } from "@mantine/notifications";
import { saveCustomPet } from "../../utils/settings";
import { useDefaultPets } from "../../hooks/usePets";

interface IPetStates {
    name: string,
    start: number,
    end: number,
}

function AddPet() {
    const { refetch } = useDefaultPets();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [frameSize, setFrameSize] = useState<number>(1);
    const [petName, setPetName] = useState<string>('');
    const [petStates, setPetStates] = useState<IPetStates[]>([
        {
            name: 'state',
            start: 1,
            end: 1,
        },
    ]);
    const { t } = useTranslation();

    const selectImage = async () => {
        const filePath = await open({
            multiple: false,
            filters: [{
                name: 'Image',
                extensions: ['png'],
            }],
        });
        if (filePath) setImageSrc(filePath as string);
    }

    const addMoreState = () => {
        const defaultStateInput = {
            name: 'state',
            start: 1,
            end: 1,
        };
        const newArr = petStates;
        newArr.push(defaultStateInput);
        setPetStates([...newArr]);
    }

    const removeStateAtIndex = (removeAtIndex: number) => {
        const newArr = petStates;
        newArr.splice(removeAtIndex, 1);
        setPetStates([...newArr]);
    }

    const combineStateToObject = () => {
        const states: {
            [key: string]: {
                start: number,
                end: number,
            }
        } = {};
        petStates.forEach(petStates => {
            states[petStates.name] = {
                start: petStates.start,
                end: petStates.end,
            }
        });

        return {
            frameSize: frameSize,
            imageSrc: imageSrc,
            name: petName,
            states: states,
        }
    }

    const verifyCustomPetObject = async () => {
        const petState = combineStateToObject();

        if (!petState.name) return false;
        if (!petState.imageSrc) return false;
        if (!petState.frameSize) return false;

        const imageSrcExist = await exists(petState.imageSrc);
        if (!imageSrcExist) return false;

        for (const state of Object.keys(petState.states)) {
            if (!state) return false;

            const stateValue = petState.states[state];
            if (!stateValue.start || stateValue.start <= 0) return false;
            if (!stateValue.end || stateValue.end <= 0) return false;
        }

        return true;
    }

    const PetStates = petStates.map((petState, index) => {
        return (
            <Accordion.Item value={index.toString()} key={index}>
                <Accordion.Control>
                    {petState.name}
                </Accordion.Control>
                <Accordion.Panel>
                    <Stack gap={"sm"}>
                        <Group grow>
                            <TextInput
                                label={t("State name")}
                                placeholder={t("State name")}
                                onChange={(event) => {
                                    const newArr = petStates;
                                    newArr[index].name = event.target.value;
                                    setPetStates([...newArr]);
                                }}
                            />
                            {/* start */}
                            <NumberInput
                                label={t("Start")}
                                placeholder={t("Enter number")}
                                min={1}
                                value={petState.start}
                                onChange={(value) => {
                                    const newArr = petStates;
                                    newArr[index].start = Number(value);
                                    setPetStates([...newArr]);
                                }}
                            />
                            {/* end */}
                            <NumberInput
                                label={t("End")}
                                placeholder={t("Enter number")}
                                min={1}
                                value={petState.end}
                                onChange={(value) => {
                                    const newArr = petStates;
                                    newArr[index].end = Number(value);
                                    setPetStates([...newArr]);
                                }}
                            />
                        </Group>
                        <Group justify="right">
                            <Button
                                variant={ButtonVariant}
                                color="red"
                                leftSection={<IconTrash />}
                                onClick={() => removeStateAtIndex(index)}
                            >
                                {t("Remove state")}
                            </Button>
                        </Group>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>
        )
    });

    return (<>
        <Fieldset legend={t("Pet information")} variant={"filled"}>
            <Stack>
                <TextInput
                    label={t("Pet name")}
                    placeholder={t("Pet name")}
                    value={petName}
                    onChange={(event) => setPetName(event.target.value)}
                />
                <NumberInput
                    min={1}
                    label={t("Frame size")}
                    placeholder={t("Frame size")}
                    value={frameSize}
                    onChange={(value) => setFrameSize(Number(value))}
                />
                <TextInput
                    label={t("Spritesheet path")}
                    placeholder={t("Spritesheet path")}
                    value={imageSrc}
                    onChange={(event) => setImageSrc(event.currentTarget.value)}
                    rightSection={
                        <Tooltip
                            label={t("Browse file")}
                            color={PrimaryColor}
                            style={{
                                color: 'white',
                            }}
                            withArrow>
                            <ActionIcon variant="transparent" className={clsx(classes.browse)}>
                                <IconFolderOpen onClick={selectImage} />
                            </ActionIcon>
                        </Tooltip>
                    } />
                <Text size={"sm"}>{t("Pet states")}</Text>
                <Accordion variant="contained">
                    {PetStates}
                </Accordion>
                <Group justify="right">
                    <Button
                        variant={ButtonVariant}
                        leftSection={<IconPlus />}
                        onClick={addMoreState}
                    >
                        {t("Add more state")}
                    </Button>
                    <Button
                        variant={ButtonVariant}
                        color={"green"}
                        leftSection={<IconCheck />}
                        onClick={async () => {
                            const canAddPet = await verifyCustomPetObject();

                            if (!canAddPet) {
                                notifications.show({
                                    message: t("Pet cannot be added, try to verify your pet information again such as image path, frame size, all state name, start and end frame"),
                                    title: t("Error: Pet cannot be added"),
                                    color: "red",
                                    icon: <IconExclamationCircle size="1rem" />,
                                    withBorder: true,
                                    autoClose: 3000,
                                })
                                return
                            }

                            await saveCustomPet(combineStateToObject());
                            refetch();
                        }}
                    >
                       {t("Add Custom Pet")}
                    </Button>
                </Group>
            </Stack>
        </Fieldset>
    </>
    )
}

export default memo(AddPet);