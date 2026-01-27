class Shield {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
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

class Key {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 33, 9, 16, 16, 1, 0.2);

        this.x = 700;
        this.y = 525;

        this.BB = new BoundingBox(this.x, this.y, 16, 32);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx);
    }
}