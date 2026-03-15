class GameController {
    constructor(game) {
        this.game = game;
        this.game.controller = this;

        this.lives = 0;
        this.key = false;
        this.level = null;
        
        this.screen = "title";
        this.endTime = 0;
    }

    clearEntities() {
        this.game.entities.forEach(function(entity) {
            entity.removeFromWorld = true;
        });
    }

    isAlive() {
        return this.lives > 0;
    }

    setKey(keyStatus) {
        this.key = keyStatus;
    }

    damage() {
        // Makes sure damage only applies if debug mode off
        if (!this.game.debugOn) {
            this.lives--;
            this.key = false;
            if (!this.isAlive()) {
                this.showDeathScreen();
                return;
            }
            this.loadLevel(this.level);
        }
    }

    showMenu() {
        this.clearEntities();
        this.lives = 0;
        this.key = false;
        this.level = null;
        this.screen = "title";
        this.game.debugOn = false;
        currentLevel = 0;
        this.game.addEntity(new HUD(this.game));
    }

    showDeathScreen() {
        this.clearEntities();
        this.lives = 0;
        this.key = false;
        this.screen = "death";
        currentLevel = 0;
        this.game.addEntity(new HUD(this.game));
    }

    showEndingScreen() {
        this.clearEntities();
        this.lives = 0;
        this.key = false;
        this.screen = "ending";
        this.endTime = this.game.timer.gameTime;
        currentLevel = 0;
        this.game.addEntity(new HUD(this.game));
    }

    loadLevel(level) {
        this.level = level;
        this.screen = "playing";
        this.clearEntities();

        const entityTypes = {
            blocks: Block1,
            spikes: Spikes,
            bouncingSpikes: BouncingSpike,
            lasers: LaserProjectile,
            shields: Shield,
            doors: Door,
            keys: Key,
            bombs: Bomb,
            rngSpikes: RNGSpike,
            movingBlocks: MovingBlock,
        };

        this.game.addEntity(new HUD(this.game));

        level.player && this.game.addEntity(new Character(this.game, level.player.x, level.player.y));
        
        for (const [key, EntityClass] of Object.entries(entityTypes)) {
            level[key]?.forEach(item => {
                this.game.addEntity(new EntityClass(this.game, item.x, item.y, item.facing));
            });
        }
    }

    update() {

    }

    draw(ctx) {

    }
}
