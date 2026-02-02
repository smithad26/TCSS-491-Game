class GameController {
    constructor(game) {
        this.game = game;
        this.game.controller = this;

        this.lives = 0;
        this.level = null;
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

        this.loadLevel(this.level);
    }

    loadLevel(level) {
        this.level = level;
        this.clearEntities();

        const entityTypes = {
            blocks: Block1,
            spikes: Spikes,
            lasers: LaserProjectile,
            shields: Shield,
            keys: Key,
        };

        this.game.addEntity(new HUD(this.game));

        level.player && this.game.addEntity(new Character(this.game, level.player.x, level.player.y));
        
        for (const [key, EntityClass] of Object.entries(entityTypes)) {
            level[key]?.forEach(item => {
                this.game.addEntity(new EntityClass(this.game, item.x, item.y));
            });
        }
    }

    update() {

    }

    draw(ctx) {

    }
}