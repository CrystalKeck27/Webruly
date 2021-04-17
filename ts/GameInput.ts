class GameInput {
    canvas: HTMLCanvasElement;
    #game: Game;

    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.canvas.addEventListener("click", this.onCLick.bind(this))
    }

    onCLick(e: MouseEvent) {
        let point = this.cellAt(e.offsetX, e.offsetY)
        let newState = (game.getCellState(point) + 1) % 3;
        let move = {
            x: point.x,
            y: point.y,
            state: newState
        }
        this.#game.setCellState(move);
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    set game(game) {
        this.#game = game;
    }

    get game() {
        return this.#game;
    }

    cellAt(x: number, y: number): Vector {
        return {
            x: Math.floor((x * this.#game.width) / this.width),
            y: Math.floor((y * this.#game.height) / this.height)
        };
    }
}

interface Vector {
    x: number;
    y: number;
}