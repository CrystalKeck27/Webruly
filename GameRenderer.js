class GameRenderer {
    canvas;
    context;
    #game;
    #theme;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.#theme = Themes.default;
    }

    render() {
        this.#renderBackground();
        this.#renderCells();
        this.#renderGridlines();
    }

    #renderBackground() {
        this.context.save();

        this.context.resetTransform();
        this.context.fillStyle = "#808080";

        this.context.fillRect(0, 0, this.width, this.height);

        this.context.restore();
    }

    #renderCells() {
        this.context.save();

        this.context.resetTransform();
        let cellSize = Math.min(this.width / this.#game.width, this.height / this.#game.height);

        for (let y = 0; y < this.#game.height; y++) {
            for (let x = 0; x < this.#game.width; x++) {
                this.context.fillStyle = "#808080";
                this.context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
        this.context.restore();
    }

    #renderGridlines() {
        this.context.save();

        this.context.resetTransform();
        this.context.strokeStyle = "#000000"

        let cellSize = Math.min(this.width / this.#game.width, this.height / this.#game.height);
        this.context.beginPath();
        for (let i = 1; i < this.#game.width; i++) {
            let csi = cellSize * i;
            this.context.moveTo(csi, 0);
            this.context.lineTo(csi, this.height);
        }
        for (let i = 1; i < this.#game.height; i++) {
            let csi = cellSize * i;
            this.context.moveTo(0, csi);
            this.context.lineTo(this.width, csi);
        }
        this.context.stroke();

        this.context.restore();
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    set game(game) {
        this.#game = game;
    }

    get game() {
        return this.#game;
    }
}