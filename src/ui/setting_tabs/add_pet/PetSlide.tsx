import { memo } from "react";
import {
    Image,
} from "@mantine/core";
import { Carousel } from '@mantine/carousel';

interface IPetSlideProps {
    imageSrc: string | undefined;
};

function PetSlide({ imageSrc } : IPetSlideProps) {
    console.log("will - i render?")
    return (
        <>
            <Carousel.Slide>
                <Image src={imageSrc} />
            </Carousel.Slide>
        </>
    )
};

export default memo(PetSlide);