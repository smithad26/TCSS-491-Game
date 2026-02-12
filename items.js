class Shield {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 9, 9, 16, 16, 1, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx, this.game);
    }
}

class Key {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 33, 9, 16, 16, 1, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 16, 32);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.drawBoundingBox(ctx, this.game);
    }
}