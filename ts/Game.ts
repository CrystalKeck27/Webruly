///<reference path="EventEmitter.ts"/>
interface Move extends Vector {
    state: CellState;
}

interface GameEvents {
    boardStateChange: () => void;
}

type Board = CellState[][];

class Game extends EventEmitter<GameEvents> {
    #width: number;
    #height: number
    #board: Board;

    constructor(width, height) {
        super();
        this.#width = width;
        this.#height = height;
        this.#board = [];
        for (let y = 0; y < height; y++) {
            this.#board[y] = [];
            for (let x = 0; x < width; x++) {
                this.#board[y][x] = CellState.EMPTY;
            }
        }
    }

    setCellState(move: Move) {
        this.#board[move.y][move.x] = move.state;
        this.emit("boardStateChange");
    }

    getCellState(point: Vector): CellState {
        return this.#board[point.y][point.x];
    }

    get width(): number {
        return this.#width;
    }

    get height(): number {
        return this.#height;
    }
}


enum CellState {
    EMPTY,
    PRIMARY,
    SECONDARY
}