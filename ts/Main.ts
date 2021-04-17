let gameRenderer: GameRenderer;
let gameInput: GameInput;
let game: Game;

// noinspection JSUnusedGlobalSymbols
function setup() {
    game = new Game(10, 8);
    game.setCellState({x:3, y:3, state: CellState.PRIMARY});

    gameInput = new GameInput("mainCanvas");
    gameInput.game = game;

    gameRenderer = new GameRenderer("mainCanvas");
    gameRenderer.game = game;
    gameRenderer.render();
}