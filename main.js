const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// const files = [
// 	"Idle",
// 	"Run",
// 	"Attack1",
// 	"Attack2",
// 	"Guard",
// ];

// for (const f of files) {
// 	ASSET_MANAGER.queueDownload(`./sprites/Warrior_${f}.png`);
// }

ASSET_MANAGER.queueDownload("./sprites/Astronaut_Player.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = "false";

	gameEngine.addEntity(new Character(gameEngine));

	gameEngine.init(ctx);

	gameEngine.start();
});
