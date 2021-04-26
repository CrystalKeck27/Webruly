let gameRenderer: GameRenderer;
let gameInput: GameInput;
let game: Game;

// noinspection JSUnusedGlobalSymbols
function setup() {
    game = new Game(8, 8);

    gameInput = new GameInput({
        canvasId: "mainCanvas",
        uniqueRowsCheckboxId: "checkbox",
        solveButtonId: "solveButton",
        resetButtonId: "resetButton"
    });
    gameInput.game = game;

    gameRenderer = new GameRenderer("mainCanvas");
    gameRenderer.game = game;
    gameRenderer.render();
}
