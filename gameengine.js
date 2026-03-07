// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};
        this.prevKeys = {};

        this.debugOn = false;

        this.music = new Audio('./sounds/slow-travel.wav');
        this.music.loop = true;
        this.music.volume = 0.1;

        this.backgroundImages = [
            './backgrounds/planet.png',
            './backgrounds/stars1.png',
            './backgrounds/stars2.png',
            './backgrounds/stars3.png',
            './backgrounds/stars4.png',
            './backgrounds/stars5.png',
        ].map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        this.backgroundLayout = [
            [0,  0,  3],
            [5,  0,  1],
            [10, 0,  4],
            [15, 0,  2],
            [20, 0,  5],
            [26, 0,  1],
            [0,  6,  3],
            [5,  6,  5],
            [10, 6,  2],
            [15, 6,  4],
            [20, 6,  0],
            [26, 6,  3],
            [0,  12, 5],
            [5,  12, 2],
            [10, 12, 4],
            [15, 12, 1],
            [20, 12, 3],
            [26, 12, 5],
            [0,  18, 2],
            [5,  18, 4],
            [10, 18, 1],
            [15, 18, 5],
            [20, 18, 3],
            [26, 18, 2],
        ];

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.controller.screen === "playing") {
            this.backgroundLayout.forEach(([col, row, imgIndex]) => {
                const img = this.backgroundImages[imgIndex];
                if (img && img.complete) {
                    this.ctx.drawImage(img, col * BLOCK_SIZE, row * BLOCK_SIZE);
                }
            });
        }

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }

        this.controller.draw(this.ctx);
    };

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        this.controller.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }

        this.prevKeys = {...this.keys};
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)