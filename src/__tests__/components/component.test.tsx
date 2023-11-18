import { describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import PetCard from "../../ui/components/PetCard";
import { ISpriteConfig } from "../../types/ISpriteConfig";
import { PetCardType } from "../../types/components/type";
import defaultPet from "../../config/pet_config";
import { afterEach } from "node:test";
import SettingWindow from "../../SettingWindow";

afterEach(() => {
    cleanup();
});

describe("SettingWindow", () => {
    it("should be defined", () => {
        render(<SettingWindow />);

        expect(screen).toBeDefined();
    });
});

// it("Should render pet card", async () => {
//     const pet: ISpriteConfig = defaultPet[0];

//     const petCardProps = {
//         btnLabel: "test",
//         pet: pet,
//         btnFunction: () => {
//             console.log("output from test");
//         },
//         type: PetCardType.Add,
//     }
//     render(<PetCard {...petCardProps} />);
//     expect(screen.getByText(pet.name)).toBeDefined();
// });