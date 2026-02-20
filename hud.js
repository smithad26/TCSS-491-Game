class HUD {
    constructor(game) {
        this.game = game;
        this.selection = 0;
    }

    update() {
        if (this.game.controller.screen === "playing") return;

        const keys = this.game.keys;
        const prevKeys = this.game.prevKeys;

        // This uses previous keys to make sure a single click moves cursor once.
        // Previously it was constant, moving too fast over middle option in menu.
        const wPressed = (keys["w"] || keys["ArrowUp"]) &&
            !(prevKeys["w"] || prevKeys["ArrowUp"]);
        const sPressed = (keys["s"] || keys["ArrowDown"]) &&
            !(prevKeys["s"] || prevKeys["ArrowDown"]);
        const enterPressed = keys["Enter"] && !prevKeys["Enter"];

        if (this.game.controller.screen === "title") {
            const optionCount = 3;
            if (wPressed) {
                this.selection = (this.selection - 1 + optionCount) % optionCount;
            }

            if (sPressed) {
                this.selection = (this.selection + 1) % optionCount;
            }

            if (!enterPressed) return;

            if (this.selection === 0) {
                this.game.controller.lives = 20;
                this.game.debugOn = false;
            } else if (this.selection === 1) {
                this.game.controller.lives = 1;
                this.game.debugOn = false;
            } else if (this.selection === 2) {
                this.game.controller.lives = 1;
                this.game.debugOn = true;
                this.game.controller.screen = "levelselect";
                this.selection = 0;
                return;
            }

            // start game and timer
            this.game.controller.loadLevel(levels_list[currentLevel]);
            return;
        }

        if (this.game.controller.screen === "levelselect") {
            const optionCount = 5;
            if (wPressed) {
                this.selection = (this.selection - 1 + optionCount) % optionCount;
            }

            if (sPressed) {
                this.selection = (this.selection + 1) % optionCount;
            }

            if (!enterPressed) return;

            currentLevel = this.selection;
            this.game.controller.loadLevel(levels_list[currentLevel]);
            return;
        }

        if ((this.game.controller.screen === "death" || this.game.controller.screen === "ending") && enterPressed) {
            this.game.controller.showMenu();
        }
    }

    draw(ctx) {
        const screen = this.game.controller.screen;
        if (screen === "title") {
            this.drawTitle(ctx);
        } else if (screen === "levelselect") {
            this.drawLevelSelect(ctx);
        } else if (screen === "ending") {
            this.drawEnding(ctx);
        } else if (screen === "death") {
            this.drawDeath(ctx);
        } else {
            if (this.game.debugOn) {
                this.drawDebugGrid(ctx);
            }

            this.drawGameplayHUD(ctx);
        }
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        const corner = Math.min(radius, width / 2, height / 2);

        ctx.beginPath();
        ctx.moveTo(x + corner, y);
        
        ctx.lineTo(x + width - corner, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + corner);

        ctx.lineTo(x + width, y + height - corner);
        ctx.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);

        ctx.lineTo(x + corner, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - corner);
        
        ctx.lineTo(x, y + corner);
        ctx.quadraticCurveTo(x, y, x + corner, y);

        ctx.closePath();
    }

    drawGameplayHUD(ctx) {
        const panelX = 16;
        const panelY = 16;
        const panelWidth = 324;
        const panelHeight = 108;

        const livesValue = this.game.debugOn ? "\u221E" : `${this.game.controller.lives}`;
        const keyValue = this.game.controller.key ? "\u2713" : " ";

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 14);
        ctx.fillStyle = "rgb(10, 24, 45)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(70, 120, 155)";
        ctx.stroke();

        const cardsY = panelY + 34;
        const cardsHeight = panelHeight - 44;
        const cardsX = panelX + 10;
        const cardsGap = 10;
        const cardWidth = (panelWidth - 20 - cardsGap) / 2;
        const keyCardX = cardsX + cardWidth + cardsGap;

        ctx.shadowColor = "rgb(82, 180, 215)";
        ctx.shadowBlur = 4;
        ctx.fillStyle = "#b9d7ef";
        ctx.font = '18px Impact, sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("LIVES", cardsX + cardWidth / 2, panelY + 10);
        ctx.fillText("KEY", keyCardX + cardWidth / 2, panelY + 10);
        ctx.shadowBlur = 0;

        this.drawRoundedRect(ctx, cardsX, cardsY, cardWidth, cardsHeight, 9);
        ctx.fillStyle = "rgb(20, 31, 47)";
        ctx.fill();
        ctx.strokeStyle = "rgb(97, 119, 141)";
        ctx.stroke();

        this.drawRoundedRect(ctx, keyCardX, cardsY, cardWidth, cardsHeight, 9);
        ctx.fillStyle = "rgb(20, 31, 47)";
        ctx.fill();
        ctx.strokeStyle = "rgb(97, 119, 141)";
        ctx.stroke();

        ctx.shadowColor = "rgb(82, 180, 215)";
        ctx.shadowBlur = 6;
        ctx.font = '34px Impact, sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const valueY = cardsY + cardsHeight / 2;

        ctx.fillStyle = "#ffe799";
        ctx.fillText(livesValue, cardsX + cardWidth / 2, valueY);

        ctx.fillStyle = "#ffe799";
        ctx.fillText(keyValue, keyCardX + cardWidth / 2, valueY);

        ctx.shadowBlur = 0;

        ctx.restore();
    }

    drawDebugGrid(ctx) {
        const tileSize = 32;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const cols = width / tileSize;
        const rows = height / tileSize;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.strokeStyle = "rgb(50, 70, 95)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += tileSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.fillStyle = "rgb(110, 135, 165)";
        ctx.font = '10px monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * tileSize;
                const y = row * tileSize;
                ctx.fillText(`${col},${row}`, x + 2, y + 2);
            }
        }

        ctx.restore();
    }

    drawTitle(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;

        const panelWidth = 520;
        const panelHeight = 380;
        const panelX = centerX - panelWidth / 2;
        const panelY = (height - panelHeight) / 2 + 50;
        const titleY = panelY - 80;

        const options = ["EASY", "NORMAL", "DEBUG"];
        const boxWidth = 340;
        const boxHeight = 58;
        const boxGap = 72;
        const boxX = centerX - boxWidth / 2;
        const firstBoxY = panelY + 96;

        const backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        backgroundGradient.addColorStop(0, "#0f1f3f");
        backgroundGradient.addColorStop(0.55, "#0a1125");
        backgroundGradient.addColorStop(1, "#03060f");
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 22);
        ctx.fillStyle = "rgb(10, 24, 45)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(70, 120, 155)";
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "rgb(82, 180, 215)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#f4faff";
        ctx.font = '68px Impact, sans-serif';
        ctx.fillText("SPACE ADVENTURE", centerX, titleY);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#b9d7ef";
        ctx.font = '24px Impact, sans-serif';
        ctx.fillText("SELECT MODE", centerX, panelY + 52);

        for (let i = 0; i < options.length; i++) {
            const boxY = firstBoxY + i * boxGap;
            const selected = this.selection === i;

            if (selected) {
                ctx.shadowColor = "rgb(88, 195, 222)";
                ctx.shadowBlur = 16;
            } else {
                ctx.shadowBlur = 0;
            }

            this.drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 14);
            ctx.fillStyle = selected ? "rgb(20, 64, 93)" : "rgb(20, 31, 47)";
            ctx.fill();
            ctx.lineWidth = selected ? 3 : 2;
            ctx.strokeStyle = selected ? "rgb(116, 229, 255)" : "rgb(97, 119, 141)";
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = selected ? "#ecfbff" : "#cce1f5";
            ctx.font = '32px Impact, sans-serif';
            ctx.fillText(options[i], centerX, boxY + boxHeight / 2);
        }

        ctx.fillStyle = "#9bb7d0";
        ctx.font = '18px Impact, sans-serif';
        ctx.fillText("W/S OR ARROW KEYS TO CHOOSE", centerX, panelY + panelHeight - 62);

        ctx.fillStyle = "#ffe799";
        ctx.font = '28px Impact, sans-serif';
        ctx.fillText("PRESS ENTER TO START", centerX, panelY + panelHeight - 28);

        ctx.restore();
    }

    drawLevelSelect(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;

        const panelWidth = 520;
        const panelHeight = 520;
        const panelX = centerX - panelWidth / 2;
        const panelY = (height - panelHeight) / 2 + 50;
        const titleY = panelY - 80;

        const options = ["LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4", "LEVEL 5"];
        const boxWidth = 340;
        const boxHeight = 58;
        const boxGap = 72;
        const boxX = centerX - boxWidth / 2;
        const firstBoxY = panelY + 76;

        const backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        backgroundGradient.addColorStop(0, "#0f1f3f");
        backgroundGradient.addColorStop(0.55, "#0a1125");
        backgroundGradient.addColorStop(1, "#03060f");
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 22);
        ctx.fillStyle = "rgb(10, 24, 45)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(70, 120, 155)";
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "rgb(82, 180, 215)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#f4faff";
        ctx.font = '68px Impact, sans-serif';
        ctx.fillText("SPACE ADVENTURE", centerX, titleY);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#b9d7ef";
        ctx.font = '24px Impact, sans-serif';
        ctx.fillText("SELECT LEVEL", centerX, panelY + 38);

        for (let i = 0; i < options.length; i++) {
            const boxY = firstBoxY + i * boxGap;
            const selected = this.selection === i;

            if (selected) {
                ctx.shadowColor = "rgb(88, 195, 222)";
                ctx.shadowBlur = 16;
            } else {
                ctx.shadowBlur = 0;
            }

            this.drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 14);
            ctx.fillStyle = selected ? "rgb(20, 64, 93)" : "rgb(20, 31, 47)";
            ctx.fill();
            ctx.lineWidth = selected ? 3 : 2;
            ctx.strokeStyle = selected ? "rgb(116, 229, 255)" : "rgb(97, 119, 141)";
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = selected ? "#ecfbff" : "#cce1f5";
            ctx.font = '32px Impact, sans-serif';
            ctx.fillText(options[i], centerX, boxY + boxHeight / 2);
        }

        ctx.fillStyle = "#9bb7d0";
        ctx.font = '18px Impact, sans-serif';
        ctx.fillText("W/S OR ARROW KEYS TO CHOOSE", centerX, panelY + panelHeight - 62);

        ctx.fillStyle = "#ffe799";
        ctx.font = '28px Impact, sans-serif';
        ctx.fillText("PRESS ENTER TO START", centerX, panelY + panelHeight - 28);

        ctx.restore();
    }

    drawEnding(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        const backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        backgroundGradient.addColorStop(0, "#1b3d2b");
        backgroundGradient.addColorStop(1, "#07140e");
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#ebfff2";
        ctx.font = '72px Impact, sans-serif';
        ctx.fillText("YOU WIN", centerX, centerY - 80);

        ctx.fillStyle = "#c9efcf";
        ctx.font = '32px Impact, sans-serif';
        ctx.fillText(`Ending time: ${this.game.controller.endTime.toFixed(2)}s`, centerX, centerY - 10);

        ctx.fillStyle = "#ffe799";
        ctx.font = '28px Impact, sans-serif';
        ctx.fillText("PRESS ENTER TO RETURN TO MAIN MENU", centerX, centerY + 70);

        ctx.restore();
    }

    drawDeath(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        const backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
        backgroundGradient.addColorStop(0, "#3a1414");
        backgroundGradient.addColorStop(1, "#130505");
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#ffecec";
        ctx.font = '72px Impact, sans-serif';
        ctx.fillText("GAME OVER", centerX, centerY - 40);

        ctx.fillStyle = "#ffe799";
        ctx.font = '28px Impact, sans-serif';
        ctx.fillText("PRESS ENTER TO RETURN TO MAIN MENU", centerX, centerY + 40);

        ctx.restore();
    }
}
