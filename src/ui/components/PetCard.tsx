import { Box, Button, Select, Title } from "@mantine/core";
import { memo, useState } from "react";
import { IPetCardProps } from "../../types/components/type";
import PhaserCanvas from "./PhaserCanvas";
import { useInView } from "react-intersection-observer";
import { ButtonVariant, CanvasSize } from "../../utils";
import { useSettingStore } from "../../hooks/useSettingStore";
import { ColorSchemeType } from "../../types/ISetting";

function PetCard({ btnLabel, pet, btnFunction, type }: IPetCardProps) {
    const randomState = Object.keys(pet.states)[Math.floor(Math.random() * Object.keys(pet.states).length)];
    const [playState, setPlayState] = useState<string>(randomState);
    const { theme: colorScheme } = useSettingStore();
    const { ref, inView } = useInView();

    return (
        <>
            <Box ref={ref}
                style={(theme) => ({
                    backgroundColor: colorScheme === ColorSchemeType.Dark ? theme.colors.dark[6] : theme.white,
                    maxWidth: '14rem',
                    minWidth: '14rem',
                    width: '224px',
                    height: '400px',
                    borderRadius: theme.radius.md,
                    boxShadow: theme.shadows.md,
                    border: `0.0625rem solid ${colorScheme === ColorSchemeType.Dark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                })}
            >
                {/* if the pet is currently in user viewport, show it, otherwise destroy its dom because it take a lot of resource */}
                {inView ?
                    <div className="">
                        <PhaserCanvas pet={pet} playState={playState} key={pet.id} />
                        <Box p={"lg"}>
                            <Title order={4} style={{
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{pet.name}</Title>
                            <Select
                                allowDeselect={false}
                                checkIconPosition={"right"}
                                my={"md"}
                                maxDropdownHeight={210}
                                placeholder="Pick one"
                                defaultValue={playState}
                                data={Object.keys(pet.states).map(state => ({ value: state, label: state, })
                                )}
                                onChange={setPlayState as any}
                            />
                            <Button variant={ButtonVariant} fullWidth onClick={btnFunction}>
                                {btnLabel}
                            </Button>
                        </Box>
                    </div>
                    :
                    <div style={{
                        height: CanvasSize,
                        width: CanvasSize,
                    }}>
                    </div>
                }
            </Box >
        </>
    )
};

export default memo(PetCard);