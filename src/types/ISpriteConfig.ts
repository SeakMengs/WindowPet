
/*
 *  If "framesize" has been specify in the config, we don't have to include these object {
 *      width, height, highestFrameMax, totalSpriteLine 
 *  }
 */
export interface ISpriteConfig {
    name: string;
    width?: number;
    height?: number;
    frameSize?: number;
    highestFrameMax?: number;
    totalSpriteLine?: number;
    imageSrc: string;
    states: {
        [key: string]: {
            spriteLine: number;
            frameMax: number;
        }
    }
}