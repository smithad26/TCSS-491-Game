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

        this.startX = x;
        this.x = x;
        this.baseY = y;
        this.y = y;
        this.facing = facing;

        this.parentBlock = null;

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
        // Find parent moving block on first update
        if (!this.parentBlock) {
            var that = this;
            this.game.entities.forEach(function (entity) {
                if (entity instanceof MovingBlock && entity.y === that.baseY) {
                    that.parentBlock = entity;
                }
            });
        }

        // Follow parent block's horizontal movement
        if (this.parentBlock) {
            this.x = this.startX + (this.parentBlock.x - this.parentBlock.startX);
        }

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

class RNGSpike {
    constructor(game, x, y, facing = "up") {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.animation = new Animator(this.spritesheet, 16, 25, 16, 16, 14, 0.1);

        this.x = x;
        this.baseY = y;
        this.y = y;
        this.facing = facing;

        // Room bounds for player proximity detection
        this.roomLeft = 0;
        this.roomRight = 4 * 32;
        this.roomTop = 2 * 32;
        this.roomBottom = 8 * 32;

        // Random x range (columns 0-3 in grid coords)
        this.minX = 0;
        this.maxX = 3;

        this.riseHeight = 32;
        this.riseSpeed = 0.08;
        this.holdTime = 0.6;
        this.fallSpeed = 0.08;

        this.extended = false;
        this.offset = 0;
        this.phase = "idle";
        this.phaseTime = 0;
        this.waitDuration = 0;
        this.playerInRoom = false;

        this.BB = new BoundingBox(0, 0, 0, 0);
        this.leftBB = new BoundingBox(0, 0, 0, 0);
        this.rightBB = new BoundingBox(0, 0, 0, 0);
    }

    cryptoRandom() {
        var array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0] / (0xFFFFFFFF + 1);
    }

    randomWait() {
        return 0.5 + this.cryptoRandom() * 4;
    }

    randomColumn() {
        var col = this.minX + Math.floor(this.cryptoRandom() * (this.maxX - this.minX + 1));
        this.x = col * 32;
    }

    isPlayerInRoom() {
        var player = null;
        this.game.entities.forEach(entity => {
            if (entity instanceof Character) player = entity;
        });
        if (!player) return false;
        return player.x >= this.roomLeft && player.x <= this.roomRight
            && player.y >= this.roomTop && player.y <= this.roomBottom;
    }

    update() {
        this.playerInRoom = this.isPlayerInRoom();

        // Only activate when player is in the room
        if (!this.playerInRoom && this.phase === "idle") return;

        // Player entered room — start the trap
        if (this.playerInRoom && this.phase === "idle") {
            this.phase = "wait";
            this.phaseTime = 0;
            this.waitDuration = this.randomWait();
        }

        // Player left room — reset to idle when not extended
        if (!this.playerInRoom && !this.extended) {
            this.phase = "idle";
            this.phaseTime = 0;
            this.offset = 0;
            this.BB = new BoundingBox(0, 0, 0, 0);
            this.leftBB = new BoundingBox(0, 0, 0, 0);
            this.rightBB = new BoundingBox(0, 0, 0, 0);
            return;
        }

        this.phaseTime += this.game.clockTick;

        if (this.phase === "wait") {
            this.offset = 0;
            this.extended = false;
            if (this.phaseTime >= this.waitDuration) {
                this.randomColumn();
                this.phase = "rise";
                this.phaseTime = 0;
            }
        } else if (this.phase === "rise") {
            this.offset = (this.phaseTime / this.riseSpeed) * this.riseHeight;
            this.extended = true;
            if (this.phaseTime >= this.riseSpeed) {
                this.offset = this.riseHeight;
                this.phase = "hold";
                this.phaseTime = 0;
            }
        } else if (this.phase === "hold") {
            this.offset = this.riseHeight;
            this.extended = true;
            if (this.phaseTime >= this.holdTime) {
                this.phase = "fall";
                this.phaseTime = 0;
            }
        } else if (this.phase === "fall") {
            this.offset = (1 - this.phaseTime / this.fallSpeed) * this.riseHeight;
            this.extended = true;
            if (this.phaseTime >= this.fallSpeed) {
                this.offset = 0;
                this.extended = false;
                this.phase = "wait";
                this.phaseTime = 0;
                this.waitDuration = this.randomWait();
            }
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

class Bomb {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/traps.png");
        this.bombAnimation = new Animator(this.spritesheet, 58, 88, 21, 25, 2, 0.4, 0);

        this.x = x;
        this.y = y;
        this.width = 42;   // 21 * 2 (Animator scales by 2x)
        this.height = 50;  // 25 * 2
        this.velocity = { x: 150, y: 0 };  // starts moving right, falls with gravity
        this.fallAcc = 562.5;
        this.bounceDamping = 0.85;          // keeps 85% velocity each bounce
        this.minBounceVelocity = 20;        // below this, stop bouncing vertically

        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {
        const TICK = this.game.clockTick;

        // gravity
        this.velocity.y += this.fallAcc * TICK;
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;

        // wrap horizontally at canvas edges
        if (this.x > 1024) this.x = 0;
        if (this.x < 0) this.x = 1024;

        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

        // collide with solid entities
        this.game.entities.forEach(entity => {
            if (entity === this || !entity.BB) return;
            const isSolid = entity instanceof Block1 || entity instanceof MovingBlock
                || entity instanceof Spikes || entity instanceof BouncingSpike
                || entity instanceof LaserProjectile || entity instanceof Shield
                || entity instanceof Key;
            if (!isSolid || !this.BB.collide(entity.BB)) return;

            // landing on top
            if (this.velocity.y > 0 && this.y + this.height - this.velocity.y * TICK <= entity.BB.top + 4) {
                this.y = entity.BB.top - this.height;
                if (Math.abs(this.velocity.y) > this.minBounceVelocity) {
                    this.velocity.y = -this.velocity.y * this.bounceDamping;
                } else {
                    this.velocity.y = 0;
                }
                this.velocity.x *= 0.995;
            }
            // hitting from below
            else if (this.velocity.y < 0 && this.y >= entity.BB.bottom - 4) {
                this.y = entity.BB.bottom;
                this.velocity.y = Math.abs(this.velocity.y) * this.bounceDamping;
            }
            // side collisions - reverse horizontal
            else {
                this.velocity.x = -this.velocity.x * this.bounceDamping;
            }
            this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        this.bombAnimation.drawFrame(this.game.clockTick, ctx, 0, 0);
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