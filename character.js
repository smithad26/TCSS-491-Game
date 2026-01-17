let state = 0;

class Character {
    constructor(game) {
        this.game = game;
        this.animators = [];
        this.x = 0;
        this.y = 0;
        this.speed = 400;

        for (const f of files) {
            const sprite = ASSET_MANAGER.getAsset(`./sprites/Warrior_${f}.png`);
            this.animators.push(new Animator(sprite, 0, 0, 192, 192, 4, 0.15));
        }
    };

    update() {
        state = 0
        const keys = this.game.keys;
        const d = this.speed * this.game.clockTick;

        if (keys["w"] || keys["ArrowUp"]) { this.y -= d; state = 1; }
        if (keys["s"] || keys["ArrowDown"]) { this.y += d; state = 1; }
        if (keys["a"] || keys["ArrowLeft"]) { this.x -= d; state = 1; }
        if (keys["d"] || keys["ArrowRight"]) { this.x += d; state = 1; }

        if (this.x > 900) this.x = -300;
        if (this.x < -300) this.x = 900;
        if (this.y > 650) this.y = -300;
        if (this.y < -300) this.y = 650;
    };

    draw(ctx) {
        this.animators[state].drawFrame(this.game.clockTick, ctx, this.x, this.y);
    };
}