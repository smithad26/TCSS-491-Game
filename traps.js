class Spikes {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 25, 16, 16, 1, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
        this.leftBB = new BoundingBox(this.x, this.y, 32 / 2, 32);
        this.rightBB = new BoundingBox(this.x + 32 / 2, this.y, 32 / 2, 32);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx);
    }
}
class LaserProjectile {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 49, 16, 16, 1, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
        this.updateBB();
    }

    updateBB() {

    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx);
    }
}