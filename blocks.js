class LaserBlock {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/blocks.png");
        this.animation = new Animator(this.spritesheet, 9, 9, 16, 16, 1, 0.2);

        this.x = 500;
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

class Block1 {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/blocks.png");
        this.animation = new Animator(this.spritesheet, 4, 2, 16, 16, 1, 0.2);

        this.x = 600;
        this.y = 325;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx);
    }
}