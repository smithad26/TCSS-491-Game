const BLOCK_SIZE = 32;
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
const GRID_COLS = CANVAS_WIDTH / BLOCK_SIZE;
const GRID_ROWS = CANVAS_HEIGHT / BLOCK_SIZE;

function blockToPixels(block) {
    return block * BLOCK_SIZE;
}

function point(x, y, facing = "up") {
    return {
        x: blockToPixels(x),
        y: blockToPixels(y),
        facing: facing,
    };
}

function fillBlocks(startX, startY, countX = 1, countY = 1) {
    const blocks = [];

    for (let i = 0; i < countX; i++) {
        for (let j = 0; j < countY; j++) {
            blocks.push(point(startX + i, startY + j));
        }
    }

    return blocks;
}

var levelOne = {
    player: point(2, 21),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),
        ...fillBlocks(16, 20, 3, 1)
    ],
    spikes: [
        ...fillBlocks(16, 22, 3, 1),
    ],
    lasers: [
        point(30, 22),
    ],
    shields: [
        point(12, 22),
    ],
    keys: [
        point(14, 22),
    ],
    ending: point(GRID_COLS, 0),
}

var levelTwo = {
    player: point(2, 21),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),
        ...fillBlocks(16, 17, 3, 1)
    ],
    spikes: [
        ...fillBlocks(6, 22, 20, 1),
    ],
    lasers: [],
    shields: [],
    keys: [],
    ending: point(GRID_COLS, 0),
}

var levelThree = {
    player: point(2, 2),
    blocks: [
        ...fillBlocks(0, 4, GRID_COLS, GRID_ROWS - 4),
    ],
    spikes: [],
    lasers: [],
    shields: [],
    keys: [],
    ending: point(GRID_COLS, 0),
}

var levels_list = [
    levelOne,
    levelTwo,
    levelThree,
];

var currentLevel = 0;
