let state = 0;

class Character {
    constructor(game) {
        this.game = game;
        this.x = 50;
        this.y = 0;
        this.speed = 400;
        this.facingleft = false;
        this.velocity = { x : 0, y : 0 };
        this.fallAcc = 562.5;

        // for (const f of files) {
        //     const sprite = ASSET_MANAGER.getAsset(`./sprites/Warrior_${f}.png`);
        //     this.animators.push(new Animator(sprite, 0, 0, 192, 192, 4, 0.15));
        // }

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
            // TODO: fill this out as entities are added to the game.
        });

    };

    draw(ctx) {
        if (this.facingleft) {
            ctx.save();
            ctx.scale(-1, 1);
            this.animators[state].drawFrame(this.game.clockTick, ctx, -(this.x) - 50, this.y);
            this.drawBoundingBox(ctx);
            ctx.restore();
        } else {
            this.animators[state].drawFrame(this.game.clockTick, ctx, this.x, this.y);
            this.drawBoundingBox(ctx);
        }
    };

    // TODO: make this function debug mode only
    /* TODO: consider moving this or other bounding box functions to boundingbox class
        to lighten code in character class. */
    drawBoundingBox(ctx) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
    };

    updateBB() {
        this.lastBB = this.BB;

        if (this.facingleft) {
            this.BB = new BoundingBox(-(this.x) - 50, this.y, 39, 64);
        } else {
            this.BB = new BoundingBox(this.x, this.y, 39, 64);
        }
    };

}