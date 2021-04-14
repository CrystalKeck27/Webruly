let gameRenderer;
let game;

function setup() {
    game = new Game(8, 8);

    gameRenderer = new GameRenderer("mainCanvas");
    gameRenderer.game = game;
    gameRenderer.render();
}