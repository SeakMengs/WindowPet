import {
    NumberInput,
    Accordion,
} from "@mantine/core";
import { memo } from "react";
import { useTranslation } from "react-i18next";

function StateInput({ framesHold, stateHold, state, exclude }: any) {
    const { t } = useTranslation();

    return (
        <>
            <Accordion.Item value={state} >
                <Accordion.Control opacity={exclude ? 0.2 : 1}>{state}</Accordion.Control>
                <Accordion.Panel>
                    {/* stateHold */}
                    <NumberInput
                        withAsterisk
                        label={t("Animate duration")}
                        placeholder={t("Animate duration")}
                        description={t("It is the time it takes for an animation to complete one cycle. If the animate duration exceeds the default animation time, it will reset to the default animation and repeat")}
                        stepHoldDelay={500}
                        min={1}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                        value={stateHold}
                    />
                    {/* framesHold */}
                    <NumberInput
                        my="xl"
                        withAsterisk
                        label={t("Animation speed")}
                        placeholder={t("Animation speed")}
                        description={t("Animation speed, the smaller the value, the faster the animation")}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                        min={1}
                        value={framesHold}
                    />
                </Accordion.Panel>
            </Accordion.Item>
        </>
    )
}

export default memo(StateInput);