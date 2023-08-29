export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    // UNKNOWN is used when the pet has no movement
    UNKNOWN = 'UNKNOWN'
}

export interface IPet extends Phaser.Physics.Arcade.Sprite {
    direction?: Direction;
    availableStates: string[];
}