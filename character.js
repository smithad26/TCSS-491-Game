let state = "idle";

class Character {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 400;
        this.facingleft = false;
        this.velocity = { x : 0, y : 0 };
        this.onGround = false;
        this.fallAcc = 562.5;
        this.shieldActive = false;
        this.shieldHit = false;
        this.shieldSprite = ASSET_MANAGER.getAsset("./sprites/items.png");
        this.shieldAnimation = new Animator(this.shieldSprite, 9, 9, 16, 16, 1, 0.2, 20);

        // lastBB assigned here to avoid game start collision bug.
        this.lastBB = new BoundingBox(this.x, this.y, 39, 64);
        this.updateBB();

        const sprite = ASSET_MANAGER.getAsset("./sprites/player.png");
        this.animators = {
            "idle": new Animator(sprite, 3, 2, 16, 16, 1, 0.15),
            "walk": new Animator(sprite, 3, 23, 16, 16, 5, 0.15),
            "jump": new Animator(sprite, 19, 44, 16, 16, 1, 0.15)
        };
    };

    update() {

        state = "idle"
        const keys = this.game.keys;
        const TICK = this.game.clockTick;
        const d = this.speed * TICK;

        if (keys["a"] || keys["ArrowLeft"]) { 
            this.x -= d; 
            state = "walk"; 
            this.facingleft = true; 
        }
        if (keys["d"] || keys["ArrowRight"]) { 
            this.x += d; 
            state = "walk"; 
            this.facingleft = false; 
        }

        if ((keys["w"] || keys["ArrowUp"] || keys[" "]) && this.onGround) {
            state = "jump"; 
            this.velocity.y = -550;
        }

        // gravity physics 
        this.velocity.y += this.fallAcc * TICK;
        this.y += this.velocity.y * TICK;

        if (this.x > 1024) {
            currentLevel++;
            if (currentLevel < levels_list.length) {
                this.game.controller.loadLevel(levels_list[currentLevel]);
            } else {
                // Display Ending, restart game
                currentLevel = 0;
            }
        }
        if (this.x < 0) this.x = 1024;

        this.updateBB();
        this.onGround = false;

        // collision
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                // These two ifs are for vertical collisions (like landing on ground)
                if (that.velocity.y > 0) {
                    if (entity instanceof Block1) {
                        // Check if the character was above the platform in the last frame
                        if (that.lastBB.bottom <= entity.BB.top) {
                            // Land on top of the platform
                            that.y = entity.BB.top - that.BB.height;
                            that.velocity.y = 0;
                            that.onGround = true;
                            that.updateBB();
                        }
                    }
                    if (entity instanceof Spikes) {
                        if (that.lastBB.bottom <= entity.BB.top) {
                            that.y = entity.BB.top - that.BB.height;
                            that.velocity.y = 0;
                            that.onGround = true;
                            that.updateBB();
                        }
                    }
                }
                if (that.velocity.y < 0) {
                    // Jumping up - check if hitting bottom of platform
                    if (entity instanceof Block1) {
                        // Check if the character was below the platform in the last frame
                        if (that.lastBB.top >= entity.BB.bottom) {
                            // Hit bottom of platform
                            that.y = entity.BB.bottom;
                            that.velocity.y = 0;
                            that.updateBB();
                        }
                    }
                    if (entity instanceof Spikes) {
                        if (that.lastBB.top >= entity.BB.bottom) {
                            that.y = entity.BB.bottom;
                            that.velocity.y = 0;
                            that.updateBB();
                        }
                    }
                }
                // Hit block from side
                if (entity instanceof Block1) {
                    if (that.BB.collide(entity.leftBB)) {
                        that.x = entity.BB.left - (entity.BB.width + 8);
                        // This line below stops players from getting stuck
                        // in block after leftward shift.
                        if (that.facingleft) that.x = entity.BB.left - (entity.BB.width + 18);
                        if (that.velocity.x > 0) that.velocity.x = 0;
                    } else if (that.BB.collide(entity.rightBB)) {
                        that.x = entity.BB.right;
                        if (that.velocity.x < 0) that.velocity.x = 0;
                    }
                    that.updateBB();
                }
                // Other collisions
                if (entity instanceof Shield) {
                    entity.removeFromWorld = true;
                    that.shieldActive = true;
                }
                if (entity instanceof Key) {
                    entity.removeFromWorld = true;
                    that.game.controller.setKey(true);
                }
                if (entity instanceof Spikes) {
                    if (that.BB.collide(entity.leftBB)) {
                        that.x = entity.BB.left - (entity.BB.width + 8);
                        if (that.facingleft) that.x = entity.BB.left - (entity.BB.width + 18);
                        if (that.velocity.x > 0) that.velocity.x = 0;
                    } else if (that.BB.collide(entity.rightBB)) {
                        that.x = entity.BB.right;
                        if (that.velocity.x < 0) that.velocity.x = 0;
                    }
                    // Damage check and shield check here.
                    if (that.shieldActive) {
                        if (!that.shieldHit) that.shieldAnimation = new Animator(that.shieldSprite, 9, 9, 16, 16, 2, 0.3, 20);
                        that.shieldHit = true;
                        // This delays shield deactivation for 3 seconds.
                        setInterval(function () {
                            that.shieldActive = false;
                            that.shieldHit = false;
                            }, 3000);
                    } else {
                        that.game.controller.damage();
                    }
                    that.updateBB();
                }
            }
        });

        if (!this.onGround) {
            state = "jump";
        }
    };

    draw(ctx) {
        if (this.facingleft) {
            ctx.save();
            ctx.scale(-1, 1);
            this.animators[state].drawFrame(this.game.clockTick, ctx, -(this.x) - 42, this.y);
            if (this.shieldActive) this.shieldAnimation.drawFrame(this.game.clockTick, ctx, -(this.x) - 46, this.y - 40);
            ctx.restore();
        } else {
            this.animators[state].drawFrame(this.game.clockTick, ctx, this.x, this.y);
            if (this.shieldActive) this.shieldAnimation.drawFrame(this.game.clockTick, ctx, this.x + 4, this.y - 40);
        }
        this.BB.drawBoundingBox(ctx, this.game);
    };

    updateBB() {
        this.lastBB = this.BB;

        if (this.facingleft) {
            this.BB = new BoundingBox(this.x + 10, this.y, 32, 32);
        } else {
            this.BB = new BoundingBox(this.x, this.y, 32, 32);
        }

    };

}