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
    canPlayRandomState: boolean;
    canRandomFlip: boolean;
    id: string;
}

export interface IWorldBounding {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface ISwitchStateOptions {
    repeat?: number,
    delay?: number,
    repeatDelay?: number,
}

// available easing options, for more info see:
// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/?h=ease
export enum Ease {
    Power0 = "Linear",
    Power1 = "Quadratic.Out",
    Power2 = "Cubic.Out",
    Power3 = "Quartic.Out",
    Power4 = "Quintic.Out",
    Quad = "Quadratic.Out",
    Cubic = "Cubic.Out",
    Quart = "Quartic.Out",
    Quint = "Quintic.Out",
    Sine = "Sine.Out",
    Expo = "Expo.Out",
    Circ = "Circular.Out",
    Elastic = "Elastic.Out",
    Back = "Back.Out",
    Bounce = "Bounce.Out",
    QuadEaseIn = "Quad.easeIn",
    CubicEaseIn = "Cubic.easeIn",
    QuartEaseIn = "Quart.easeIn",
    QuintEaseIn = "Quint.easeIn",
    SineEaseIn = "Sine.easeIn",
    ExpoEaseIn = "Expo.easeIn",
    CircEaseIn = "Circ.easeIn",
    BackEaseIn = "Back.easeIn",
    BounceEaseIn = "Bounce.easeIn",
    QuadEaseOut = "Quad.easeOut",
    CubicEaseOut = "Cubic.easeOut",
    QuartEaseOut = "Quart.easeOut",
    QuintEaseOut = "Quint.easeOut",
    SineEaseOut = "Sine.easeOut",
    ExpoEaseOut = "Expo.easeOut",
    CircEaseOut = "Circ.easeOut",
    BackEaseOut = "Back.easeOut",
    BounceEaseOut = "Bounce.easeOut",
    QuadEaseInOut = "Quad.easeInOut",
    CubicEaseInOut = "Cubic.easeInOut",
    QuartEaseInOut = "Quart.easeInOut",
    QuintEaseInOut = "Quint.easeInOut",
    SineEaseInOut = "Sine.easeInOut",
    ExpoEaseInOut = "Expo.easeInOut",
    CircEaseInOut = "Circ.easeInOut",
    BackEaseInOut = "Back.easeInOut",
    BounceEaseInOut = 'Bounce.easeInOut'
}