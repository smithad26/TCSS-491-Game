const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/Astronaut_Player.png");
ASSET_MANAGER.queueDownload("./sprites/items.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = "false";

	// player
	gameEngine.addEntity(new Character(gameEngine));

	// traps
	gameEngine.addEntity(new Laser(gameEngine));

	// items
	gameEngine.addEntity(new Shield(gameEngine));
	gameEngine.addEntity(new Key(gameEngine));

	gameEngine.init(ctx);

	gameEngine.start();
});
