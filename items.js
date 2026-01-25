class Shield {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 9, 9, 16, 16, 1, 0.2);
        this.updateBB();

        this.x = 500;
        this.y = 525;
    }

    updateBB() {

    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}

class Key {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 27, 9, 16, 16, 1, 0.2);
        this.updateBB();

        this.x = 700;
        this.y = 525;
    }

    updateBB() {

    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
}