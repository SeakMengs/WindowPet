import Phaser from "phaser";

/**
 * Manages Christmas-themed falling snow effect.
 * Snow textures are generated programmatically (no external assets).
 */
export class ChristmasManager {
    private scene: Phaser.Scene;
    private snowEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null =
        null;
    private groundSnow: Phaser.GameObjects.Graphics | null = null;
    private enabled: boolean = false;

    private readonly SNOWFLAKE_KEY = "xmas_snowflake";

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    enable(): void {
        if (this.enabled) return;
        this.enabled = true;

        this.createTexture();
        this.createSnow();
        this.createGroundSnow();
    }

    disable(): void {
        if (!this.enabled) return;
        this.enabled = false;

        if (this.snowEmitter) {
            this.snowEmitter.destroy();
            this.snowEmitter = null;
        }

        if (this.groundSnow) {
            this.groundSnow.destroy();
            this.groundSnow = null;
        }

        if (this.scene.textures.exists(this.SNOWFLAKE_KEY)) {
            this.scene.textures.remove(this.SNOWFLAKE_KEY);
        }
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    private createTexture(): void {
        if (!this.scene.textures.exists(this.SNOWFLAKE_KEY)) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xffffff, 0.9);
            gfx.fillCircle(4, 4, 4);
            gfx.generateTexture(this.SNOWFLAKE_KEY, 8, 8);
            gfx.destroy();
        }
    }

    private createSnow(): void {
        const width = this.scene.physics.world.bounds.width;

        this.snowEmitter = this.scene.add.particles(
            0,
            -10,
            this.SNOWFLAKE_KEY,
            {
                x: { min: 0, max: width },
                y: -10,
                lifespan: { min: 8000, max: 15000 },
                speedY: { min: 15, max: 50 },
                speedX: { min: -15, max: 15 },
                scale: { min: 0.2, max: 0.8 },
                alpha: { start: 0.7, end: 0.1 },
                quantity: 1,
                frequency: 200,
                gravityY: 8,
            }
        );
        this.snowEmitter.setDepth(-1);
    }

    private createGroundSnow(): void {
        const width = this.scene.physics.world.bounds.width;
        const groundY = window.screen.availHeight;

        this.groundSnow = this.scene.add.graphics();
        this.groundSnow.setDepth(-2);

        // Thin snow layer on ground
        this.groundSnow.fillStyle(0xffffff, 0.4);
        this.groundSnow.fillRect(0, groundY - 6, width, 6);

        // Irregular snow bumps along the ground
        this.groundSnow.fillStyle(0xffffff, 0.35);
        for (let x = 0; x < width; x += Phaser.Math.Between(30, 60)) {
            const bumpRadius = Phaser.Math.Between(4, 10);
            this.groundSnow.fillCircle(x, groundY - 6, bumpRadius);
        }
    }
}
