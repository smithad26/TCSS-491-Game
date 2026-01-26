class GameController {
    constructor(game) {
        this.game = game;
        this.game.controller = this;

        this.lives = 0;
    }

    clearEntities() {
        this.game.entities.forEach(function(entity) {
            entity.removeFromWorld = true;
        });
    }

    isAlive() {
        return this.lives > 0;
    }

    damage() {
        this.lives--;

        if (!this.isAlive()) {
            this.clearEntities();
            this.game.addEntity(new HUD(this.game));
            return;
        }

        this.loadLevel();
    }

    // Later this will load the levels
    loadLevel() {
        this.clearEntities();

        // player
        this.game.addEntity(new Character(this.game));

        // traps
        this.game.addEntity(new Spikes(this.game));
        this.game.addEntity(new Laser(this.game));

        // items
        this.game.addEntity(new Shield(this.game));
        this.game.addEntity(new Key(this.game));

        this.game.addEntity(new HUD(this.game));
    }

    update() {

    }

    draw(ctx) {

    }
}