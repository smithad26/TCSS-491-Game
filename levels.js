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

function fillBlocks(startX, startY, countX = 1, countY = 1, facing = "up") {
    const blocks = [];

    for (let i = 0; i < countX; i++) {
        for (let j = 0; j < countY; j++) {
            blocks.push(point(startX + i, startY + j, facing));
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
    doors: [
        point(24, 21),
    ],
    keys: [
        point(14, 22),
    ],
    ending: point(GRID_COLS, 0),
}

// Level 2: Zigzag ladder of 8 platforms from bottom-left to top-right.
// Each platform has a bouncing spike. Exit at top-right (cols 29-31, row 2).
// Grid: 32 cols (0-31), 24 rows (0-23). Floor at row 23.
var levelTwo = {
    player: point(2, 21),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),  // floor
        ...fillBlocks(31, 3, 1, GRID_ROWS - 3),  // right wall
        ...fillBlocks(29, 2,  3, 1),  // exit platform (cols 29-31, row 2)
        // Enclosed room
        ...fillBlocks(0, 2, 4, 1),   // top wall (0-3, row 2)
        ...fillBlocks(0, 7, 4, 1),   // bottom wall (0-3, row 7)
        ...fillBlocks(4, 3, 1, 2),   // right wall above door (4, rows 3-4)
        ...fillBlocks(4, 7, 1, 1),   // right wall below door (4, row 7)
    ],
    movingBlocks: [
        ...fillBlocks(3,  20, 3, 1, "right"),  // P1 right
        ...fillBlocks(10, 18, 3, 1, "left"),   // P2 left
        ...fillBlocks(4,  16, 3, 1, "right"),  // P3 right
        ...fillBlocks(12, 14, 3, 1, "left"),   // P4 left
        ...fillBlocks(5,  11, 3, 1, "right"),  // P5 right
        ...fillBlocks(14, 9,  3, 1, "left"),   // P6 left
        ...fillBlocks(7,  6,  3, 1, "right"),  // P7 right
        ...fillBlocks(16, 4,  3, 1, "left"),   // P8 left
    ],
    spikes: [
        ...fillBlocks(5, 22, 26, 1), // floor spikes (5,22) to (30,22)
    ],
    bouncingSpikes: [
        point(4,  20), // on P1
        point(11, 18), // on P2
        point(5,  16), // on P3
        point(13, 14), // on P4
        point(6,  11), // on P5
        point(15, 9),  // on P6
        point(8,  6),  // on P7
        point(17, 4),  // on P8
    ],
    rngSpikes: [
        point(1, 7),   // inside enclosed room, pops up from floor
    ],
    lasers: [],
    shields: [
        point(0, 6),   // shield inside enclosed room
    ],
    doors: [
        point(4, 5),   // door to enclosed room (2 tiles tall, rows 5-6)
    ],
    keys: [
        point(15, 3),  // key on P8 platform area
    ],
    ending: point(GRID_COLS, 0),
}

var levelThree = {
    player: point(2, 21),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),
        ...fillBlocks(8, 18, 4, 1),
        ...fillBlocks(20, 15, 4, 1),
        ...fillBlocks(10, 12, 4, 1),
    ],
    spikes: [
        ...fillBlocks(12, 22, 6, 1),
    ],
    lasers: [
        point(26, 22),
        point(28, 22),
    ],
    shields: [
        point(6, 22),
    ],
    keys: [
        point(22, 14),
    ],
    ending: point(GRID_COLS, 0),
}

var levelFour = {
    player: point(2, 21),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),
        ...fillBlocks(6, 20, 2, 1),
        ...fillBlocks(12, 17, 3, 1),
        ...fillBlocks(20, 14, 3, 1),
        ...fillBlocks(26, 11, 3, 1),
    ],
    spikes: [
        ...fillBlocks(8, 22, 4, 1),
        ...fillBlocks(16, 22, 8, 1),
    ],
    lasers: [
        point(14, 16),
        point(22, 13),
        point(28, 10),
    ],
    shields: [
        point(4, 22),
    ],
    keys: [
        point(27, 10),
    ],
    ending: point(GRID_COLS, 0),
}

var levelFive = {
    player: point(1, 19),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),
        ...fillBlocks(0, 20, 3, 1),
        ...fillBlocks(6, 13, 4, 1),
    ],
    spikes: [
        ...fillBlocks(0, GRID_ROWS - 2, GRID_COLS, 1),
        point(6, 12),
        point(9, 12),
    ],
    lasers: [
        point(0, 18),
        point(0, 12),
    ],
    ending: point(GRID_COLS, 0),
}

var levelSix = {
    player: point(1, 19),
    blocks: [
        ...fillBlocks(0, GRID_ROWS - 1, GRID_COLS, 1),
        ...fillBlocks(0, 0, GRID_COLS, 1),
        ...fillBlocks(31, 3, 1, 20),
        ...fillBlocks(5, 16, 1, 7),
        ...fillBlocks(8, 21, 3, 1),
        ...fillBlocks(13, 1, 1, 13),
        ...fillBlocks(16, 16, 3, 1),
        ...fillBlocks(14, 13, 15, 1),
        ...fillBlocks(28, 21, 3, 1),
        ...fillBlocks(16, 8, 15, 1),
        ...fillBlocks(23, 3, 1, 5),
        ...fillBlocks(27, 1, 1, 5),
    ],
    spikes: [
        ...fillBlocks(6, 22, GRID_COLS - 6, 1),
    ],
    bouncingSpikes: [
        point(9, 21),
        point(17, 16),
        point(29, 21),
    ],
    lasers: [
        ...fillBlocks(14, 9, 1, 1),
        ...fillBlocks(14, 2, 1, 1),
    ],
    ending: point(GRID_COLS, 0),
}

var levels_list = [
    levelOne,
    levelTwo,
    levelThree,
    levelFour,
    levelFive,
    levelSix,
];

var currentLevel = 0;
