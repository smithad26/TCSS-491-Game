class Shield {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 9, 9, 16, 16, 8, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
    }

    update() {

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.facing === "down") {
            ctx.rotate(Math.PI);
            this.animation.drawFrame(this.game.clockTick, ctx, -32, -32);
        } else if (this.facing === "left") {
            ctx.rotate((3 * Math.PI) / 2);
            this.animation.drawFrame(this.game.clockTick, ctx, -32, 0);
        } else if (this.facing === "right") {
            ctx.rotate(Math.PI / 2);
            this.animation.drawFrame(this.game.clockTick, ctx, 0, -32);
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, 0, 0);
        }
        ctx.restore();
        this.BB.drawBoundingBox(ctx, this.game);
    }
}

class Key {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.animation = new Animator(this.spritesheet, 13, 36, 8, 16, 8, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 16, 32);
    }

    update() {

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.facing === "down") {
            ctx.rotate(Math.PI);
            this.animation.drawFrame(this.game.clockTick, ctx, -32, -32);
        } else if (this.facing === "left") {
            ctx.rotate((3 * Math.PI) / 2);
            this.animation.drawFrame(this.game.clockTick, ctx, -32, 0);
        } else if (this.facing === "right") {
            ctx.rotate(Math.PI / 2);
            this.animation.drawFrame(this.game.clockTick, ctx, 0, -32);
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, 0, 0);
        }
        ctx.restore();
        this.BB.drawBoundingBox(ctx, this.game);
    }
}