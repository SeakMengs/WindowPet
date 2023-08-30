export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    UPSIDELEFT = 'UPSIDELEFT',
    UPSIDERIGHT = 'UPSIDERIGHT',
    // UNKNOWN is used when the pet has no movement
    UNKNOWN = 'UNKNOWN',
}

export interface IPet extends Phaser.Physics.Arcade.Sprite {
    direction?: Direction;
    availableStates: string[];
}

export interface IWorldBounding {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface ISwitchStateOptions  {
    repeat?: number,
    delay?: number,
    repeatDelay?: number,
}