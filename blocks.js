class LaserBlock {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/blocks.png");
        this.animation = new Animator(this.spritesheet, 9, 9, 16, 16, 1, 0.2);

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

class Block1 {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/blocks.png");
        this.animation = new Animator(this.spritesheet, 4, 2, 16, 16, 1, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
        this.leftBB = new BoundingBox(this.x, this.y, 32 / 2, 32);
        this.rightBB = new BoundingBox(this.x + 32 / 2, this.y, 32 / 2, 32);
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

class MovingBlock {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/blocks.png");
        this.animation = new Animator(this.spritesheet, 4, 2, 16, 16, 1, 0.2);

        this.startX = x;
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.reverse = (facing === "left");

        this.moveRange = 3 * 32;
        this.cycleDuration = 6; // seconds for a full back-and-forth

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
        this.leftBB = new BoundingBox(this.x, this.y, 32 / 2, 32);
        this.rightBB = new BoundingBox(this.x + 32 / 2, this.y, 32 / 2, 32);
    }

    update() {
        // Triangle wave: all blocks with same y move in sync
        var t = this.game.timer.gameTime / this.cycleDuration;
        var phase = t % 1;
        // Reverse direction: shift phase by 0.5
        if (this.reverse) phase = (phase + 0.5) % 1;
        var offset;
        if (phase < 0.5) {
            offset = phase * 2 * this.moveRange;
        } else {
            offset = (1 - (phase - 0.5) * 2) * this.moveRange;
        }

        this.x = this.startX + offset;

        this.BB = new BoundingBox(this.x, this.y, 32, 32);
        this.leftBB = new BoundingBox(this.x, this.y, 32 / 2, 32);
        this.rightBB = new BoundingBox(this.x + 32 / 2, this.y, 32 / 2, 32);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        this.animation.drawFrame(this.game.clockTick, ctx, 0, 0);
        ctx.restore();
        this.BB.drawBoundingBox(ctx, this.game);
    }
}

class Door {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/blocks.png");
        this.animation = new Animator(this.spritesheet, 4, 26, 16, 32, 1, 0.2);

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 32, 64);
        this.leftBB = new BoundingBox(this.x, this.y, 32 / 2, 64);
        this.rightBB = new BoundingBox(this.x + 32 / 2, this.y, 32 / 2, 64);
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