class Spikes {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 25, 16, 16, 14, 0.1);

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
class BouncingSpike {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 25, 16, 16, 14, 0.1);

        this.x = x;
        this.baseY = y;
        this.y = y;
        this.facing = facing;

        this.elapsedTime = 0;
        this.riseHeight = 32;   // how far up the spike pops
        this.riseSpeed = 0.08;  // seconds to fully extend
        this.holdTime = 0.6;    // seconds to stay extended
        this.fallSpeed = 0.08;  // seconds to retract
        this.waitTime = 2.5;    // seconds hidden before next pop
        this.cycleTime = this.riseSpeed + this.holdTime + this.fallSpeed + this.waitTime;

        this.extended = false;
        this.offset = 0;

        this.BB = new BoundingBox(0, 0, 0, 0);
        this.leftBB = new BoundingBox(0, 0, 0, 0);
        this.rightBB = new BoundingBox(0, 0, 0, 0);
    }

    update() {
        this.elapsedTime += this.game.clockTick;
        var t = this.elapsedTime % this.cycleTime;

        if (t < this.riseSpeed) {
            // rising
            this.offset = (t / this.riseSpeed) * this.riseHeight;
            this.extended = true;
        } else if (t < this.riseSpeed + this.holdTime) {
            // holding at top
            this.offset = this.riseHeight;
            this.extended = true;
        } else if (t < this.riseSpeed + this.holdTime + this.fallSpeed) {
            // retracting
            var fallT = t - this.riseSpeed - this.holdTime;
            this.offset = (1 - fallT / this.fallSpeed) * this.riseHeight;
            this.extended = true;
        } else {
            // hidden/waiting
            this.offset = 0;
            this.extended = false;
        }

        this.y = this.baseY - this.offset;

        if (this.extended) {
            this.BB = new BoundingBox(this.x, this.y, 32, 32);
            this.leftBB = new BoundingBox(this.x, this.y, 32 / 2, 32);
            this.rightBB = new BoundingBox(this.x + 32 / 2, this.y, 32 / 2, 32);
        } else {
            this.BB = new BoundingBox(0, 0, 0, 0);
            this.leftBB = new BoundingBox(0, 0, 0, 0);
            this.rightBB = new BoundingBox(0, 0, 0, 0);
        }
    }

    draw(ctx) {
        if (!this.extended) return;

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
        this.animation = new Animator(this.spritesheet, 16, 49, 16, 16, 12, 0.1);
        this.fireAnimation = new Animator(this.spritesheet, 2, 70, 256, 16, 5, 1, 500);
        this.firing = false;

        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, 480, 32);
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