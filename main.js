const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/player.png");
ASSET_MANAGER.queueDownload("./sprites/items.png");
ASSET_MANAGER.queueDownload("./sprites/traps.png");
ASSET_MANAGER.queueDownload("./sprites/blocks.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	new GameController(gameEngine);
	gameEngine.addEntity(new HUD(gameEngine));

	gameEngine.init(ctx);

	gameEngine.start();
});
