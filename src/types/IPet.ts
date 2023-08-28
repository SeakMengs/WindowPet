export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    // UNKNOWN is used when the pet is being dragged
    UNKNOWN = 'UNKNOWN'
}

export interface IPet extends Phaser.Physics.Arcade.Sprite {
    direction?: Direction;
}