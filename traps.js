class Spikes {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 25, 16, 16, 1, 0.2);

        this.x = x;
        this.y = y;
        this.facing = facing;

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
class LaserProjectile {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 49, 16, 16, 1, 0.2);
        this.fireAnimation = new Animator(this.spritesheet, 24, 49, 256, 16, 5, 1, 500);
        this.firing = false;

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 518, 32);
        this.updateBB();
    }

    updateBB() {

    }

    update() {
        if (this.fireAnimation.currentFrame() === 0) {
            this.fire();
        } else {
            this.stopFire();
        }
    }

    fire() {
        this.firing = true;
    }

    stopFire() {
        this.firing = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.facing === "down") {
            ctx.rotate(Math.PI);
            this.animation.drawFrame(this.game.clockTick, ctx, -32, -32);
            this.fireAnimation.drawFrame(this.game.clockTick, ctx, -32, -36);
        } else if (this.facing === "left") {
            ctx.rotate((3 * Math.PI) / 2);
            this.animation.drawFrame(this.game.clockTick, ctx, -32, 0);
            this.fireAnimation.drawFrame(this.game.clockTick, ctx, -36, 0);
        } else if (this.facing === "right") {
            ctx.rotate(Math.PI / 2);
            this.animation.drawFrame(this.game.clockTick, ctx, 0, -32);
            this.fireAnimation.drawFrame(this.game.clockTick, ctx, 4, -32);
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, 0, 0);
            this.fireAnimation.drawFrame(this.game.clockTick, ctx, 4, 0);
        }
        ctx.restore();
        this.BB.drawBoundingBox(ctx, this.game);
    }
}