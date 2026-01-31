let state = "idle";

class Character {
    constructor(game) {
        this.game = game;
        this.x = 50;
        this.y = 0;
        this.speed = 400;
        this.facingleft = false;
        this.velocity = { x : 0, y : 0 };
        this.fallAcc = 562.5;
        this.shieldActive = false;

        // lastBB assigned here to avoid game start collision bug.
        this.lastBB = new BoundingBox(this.x, this.y, 39, 64);
        this.updateBB();

        const sprite = ASSET_MANAGER.getAsset("./sprites/Astronaut_Player.png");
        this.animators = {
            "idle": new Animator(sprite, 7, 65, 32, 35, 1, 0.15),
            "walk": new Animator(sprite, 7, 65, 32, 35, 8, 0.15),
            "jump": new Animator(sprite, 7, 65, 32, 35, 1, 0.15)
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

        const groundY = 500;
        const onGround = this.y >= groundY;
        if ((keys["w"] || keys["ArrowUp"]) && onGround) { 
            
            state = "jump"; 
            this.velocity.y = -550;
        }

        // gravity physics 
        this.velocity.y += this.fallAcc * TICK;
        this.y += this.velocity.y * TICK;

        if (this.y > groundY) {
            this.y = groundY;
            this.velocity.y = 0;
        }

        if (!onGround) {
            state = "jump"
        }

        if (this.x > 1024) this.x = 0;
        if (this.x < 0) this.x = 1024;

        this.updateBB();

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
                            that.updateBB();
                        }
                    }
                    if (entity instanceof Spikes) {
                        if (that.lastBB.bottom <= entity.BB.top) {
                            that.y = entity.BB.top - that.BB.height;
                            that.velocity.y = 0;
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
                        // This delays shield deactivation for 3 seconds.
                        setInterval(function () {
                            that.shieldActive = false;
                            }, 3000);
                    } else {
                        that.game.controller.damage();
                    }
                    that.updateBB();
                }

            }
        });

    };

    draw(ctx) {
        if (this.facingleft) {
            ctx.save();
            ctx.scale(-1, 1);
            this.animators[state].drawFrame(this.game.clockTick, ctx, -(this.x) - 50, this.y);
            ctx.restore();
        } else {
            this.animators[state].drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
        this.BB.drawBoundingBox(ctx);
    };

    updateBB() {
        this.lastBB = this.BB;

        if (this.facingleft) {
            this.BB = new BoundingBox(this.x + 10, this.y, 39, 64);
        } else {
            this.BB = new BoundingBox(this.x, this.y, 39, 64);
        }

    };

}