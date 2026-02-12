class HUD {
    constructor(game) {
        this.game = game;
        this.selection = 0;
    }

    update() {
        if (this.game.controller.isAlive()) return;

        const keys = this.game.keys;
        const prevKeys = this.game.prevKeys;

        // This uses previous keys to make sure a single click moves cursor once.
        // Previously it was constant, moving too fast over middle option in menu.
        const wPressed = (keys["w"] || keys["ArrowUp"]) &&
            !(prevKeys["w"] || prevKeys["ArrowUp"]);
        const sPressed = (keys["s"] || keys["ArrowDown"]) &&
            !(prevKeys["s"] || prevKeys["ArrowDown"]);

        if (wPressed) {
            if (this.selection === 2) {
                this.selection = 1;
            } else {
                this.selection = 0;
            }
        }

        if (sPressed) {
            if (this.selection === 0) {
                this.selection = 1;
            } else {
                this.selection = 2;
            }
        }

        if ((keys["Enter"])) {
            this.game.controller.lives = this.selection === 0 ? 20 : 1;
            if (this.selection === 0) {
                this.game.controller.lives = 20;
                this.game.debugOn = false;
            } else if (this.selection === 1) {
                this.game.controller.lives = 1;
                this.game.debugOn = false;
            } else {
                this.game.controller.lives = 1;
                this.game.debugOn = true;
            }
            this.game.controller.loadLevel(levelOne);
        }
    }

    draw(ctx) {
        if (!this.game.controller.isAlive()) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.fillStyle = "white";
            ctx.font = '60px Impact, sans-serif';
            ctx.fillText("SPACE ADVENTURE", 170, 180);

            ctx.font = '30px Impact, sans-serif';
            ctx.fillText("Press ENTER to start", 330, 260);

            const easy = (this.selection === 0) ? "> EASY" : "  EASY";
            const normal = (this.selection === 1) ? "> NORMAL" : "  NORMAL";
            const debug= (this.selection === 2) ? "> DEBUG" : "  DEBUG";

            ctx.fillText(easy, 370, 360);
            ctx.fillText(normal, 370, 410);
            ctx.fillText(debug, 370, 460);

            ctx.restore();
        }
        else {
            ctx.font = '30px Impact, sans-serif';
            ctx.fillStyle = "Red";
            if (this.game.debugOn) {
                ctx.fillText(`Lives: \u221E`, 20, 50);
            } else {
                ctx.fillText(`Lives: ${this.game.controller.lives}`, 20, 50);
            }

            ctx.font = '30px Impact, sans-serif';
            ctx.fillStyle = "Gold";
            let checkmark = " ";
            if (this.game.controller.key === true) checkmark = "\u2713";
            ctx.fillText(`Key: ${checkmark}`, 20, 80);
        }
    }
}