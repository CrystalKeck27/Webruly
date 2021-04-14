class Game {
    static CellState = Object.freeze({EMPTY: 1, BLACK:2, WHITE:3});

    #width;
    #height;
    #board;

    constructor(width, height) {
        this.#width = width;
        this.#height = height;
        this.#board = [];
        for (let y = 0; y < height; y++) {
            this.#board[y] = [];
            for (let x = 0; x < width; x++) {
                this.#board[y][x] = Game.CellState.EMPTY;
            }
        }
    }

    getCellState(x, y) {
        return this.#board[y][x];
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }
}