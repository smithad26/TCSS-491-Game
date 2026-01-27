class Spikes {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 25, 16, 16, 1, 0.2);

        this.x = 600;
        this.y = 525;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx);
    }
}
class Laser {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 49, 16, 16, 1, 0.2);

        this.x = 800;
        this.y = 525;

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