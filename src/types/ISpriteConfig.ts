export interface ISpriteConfig {
    name: string;
    width: number;
    height: number;
    highestFrameMax: number;
    totalSpriteLine: number;
    imageSrc: string;
    states: {
        [key: string]: {
            spriteLine: number;
            frameMax: number;
        }
    }
}