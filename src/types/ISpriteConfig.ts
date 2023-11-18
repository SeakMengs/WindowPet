export interface ISpriteStateKey {
    [key: string]: {
        // if specify frameMax and spriteLine, the app will auto calculate the tile map
        spriteLine?: number;
        frameMax?: number;
        // if specify start and end, the app will choose the state animation from position start - 1 to end - 1
        start?: number;
        end?: number;
    }
}

export enum SpriteType {
    DEFAULT = 'default',
    CUSTOM = 'custom',
}

/*
 *  If "framesize" has been specify in the config, we don't have to include these object {
 *      width, height, highestFrameMax, totalSpriteLine 
 *  }
 */
export interface ISpriteConfig {
    name: string,
    credit?: {
        // link to download
        resource?: string,
        // link to post, etc
        link?: string,
        // link or string of name to social media
        socialMedia?: string,
    },
    id?: string,
    width?: number,
    height?: number,
    frameSize?: number,
    highestFrameMax?: number,
    totalSpriteLine?: number,
    type?: SpriteType,
    customId?: string,
    imageSrc: string,
    states: ISpriteStateKey,
}

export interface IPetObject {
    frameSize: number;
    imageSrc: string;
    name: string;
    states: {
        [key: string]: {
            start: number;
            end: number;
        };
    };
    customId?: string;
}