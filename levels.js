function fillBlocks(startX, startY, countX, countY = 1) {
    const blocks = [];

    for (let i = 0; i < countX; i++) {
        for (let j = 0; j < countY; j++) {
            blocks.push({ x: startX + i * 32, y: startY + j * 32 });
        }
    }

    return blocks;
}

var levelOne = {
    player: { x: 50, y: 672 },
    blocks: [
        ...fillBlocks(0, 736, 33, 1),
        ...fillBlocks(512, 640, 3, 1)
    ],
    spikes: [
        { x: 512, y: 704 },
        { x: 544, y: 704 },
        { x: 576, y: 704 },
    ],
    lasers: [
        { x: 960, y: 704 },
    ],
    shields: [
        { x: 384, y: 704 },
    ],
    keys: [
        { x: 448, y: 704 },
    ],
    ending: { x: 1024, y: 0},
}

var levelTwo = {
    player: { x: 50, y: 672 },
    blocks: [
        ...fillBlocks(0, 736, 33, 1),
        ...fillBlocks(512, 540, 3, 1)
    ],
    spikes: [
        // ...fillBlocks(512, 640, 3, 1)
        ...fillBlocks(193, 704, 20, 1),
    ],
    lasers: [],
    shields: [],
    keys: [],
    ending: { x: 1024, y: 0},
}

var levelThree = {
    player: { x: 50, y: 72 },
    blocks: [
        ...fillBlocks(0, 136, 33, 33),
    ],
    spikes: [],
    lasers: [],
    shields: [],
    keys: [],
    ending: { x: 1024, y: 0},
}

var levels_list = [levelOne, levelTwo, levelThree];

var currentLevel = 0;
