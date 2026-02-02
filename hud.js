class HUD {
    constructor(game) {
        this.game = game;
        this.selection = 0;
    }

    update() {
        if (this.game.controller.isAlive()) return;

        const keys = this.game.keys;

        if ((keys["w"] || keys["ArrowUp"])) { 
            this.selection = 0;
        }

        if ((keys["s"] || keys["ArrowDown"])) { 
            this.selection = 1;
        }

        if ((keys["Enter"])) {
            this.game.controller.lives = this.selection === 0 ? 20 : 1;
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

            ctx.fillText(easy, 370, 360);
            ctx.fillText(normal, 370, 410);

            ctx.restore();
        }
        else {
            ctx.font = '72px Impact, sans-serif';
            ctx.fillStyle = "White";
            ctx.fillText(`Lives: ${this.game.controller.lives}`, 20, 80);
        }
    }
}