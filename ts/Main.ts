let gameRenderer: GameRenderer;
let gameInput: GameInput;
let game: Game;

// noinspection JSUnusedGlobalSymbols
function setup() {
    game = new Game(8, 8);

    gameInput = new GameInput("mainCanvas");
    gameInput.game = game;

    gameRenderer = new GameRenderer("mainCanvas");
    gameRenderer.game = game;
    gameRenderer.render();
}
