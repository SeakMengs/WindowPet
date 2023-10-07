
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
            // if specify frameMax and spriteLine, the app will auto calculate the tile map
            spriteLine?: number;
            frameMax?: number;
            // if specify start and end, the app will choose the state animation from position start - 1 to end - 1
            start?: number;
            end?: number;
        }
    }
}