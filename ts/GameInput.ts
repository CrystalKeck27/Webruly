interface GameInputElements {
    canvasId: string;
    uniqueRowsCheckboxId?: string;
    solveButtonId?: string;
    resetButtonId?: string;
}

class GameInput {
    canvas: HTMLCanvasElement;
    #game: Game;

    constructor(ids: GameInputElements) {
        this.canvas = <HTMLCanvasElement>document.getElementById(ids.canvasId);
        this.canvas.addEventListener("click", this.onPrimary.bind(this));
        this.canvas.addEventListener("contextmenu", this.onCtxMenu.bind(this));
        document.addEventListener("keydown", this.onKeyPress.bind(this));
        if (ids.uniqueRowsCheckboxId) {
            let checkbox = <HTMLInputElement>document.getElementById(ids.uniqueRowsCheckboxId);
            checkbox.addEventListener("change", this.onCheckboxChange.bind(this));
        }
        if (ids.solveButtonId) {
            let checkbox = <HTMLButtonElement>document.getElementById(ids.solveButtonId);
            checkbox.addEventListener("click", this.solve.bind(this));
        }
        if (ids.resetButtonId) {
            let checkbox = <HTMLButtonElement>document.getElementById(ids.resetButtonId);
            checkbox.addEventListener("click", this.reset.bind(this));
        }
    }

    onPrimary(e: MouseEvent) {
        this.onClick(e, 1);
    }

    onCtxMenu(e: MouseEvent) {
        e.preventDefault();
        this.onClick(e, 2);
        return false;
    }

    private onClick(e: MouseEvent, offset: number) {
        let point = this.cellAt(e.offsetX, e.offsetY);
        let newState = (game.getCellState(point) + offset) % 3;
        let move = {
            x: point.x,
            y: point.y,
            state: newState
        };
        this.#game.setCellState(move);
    }

    onKeyPress(e: KeyboardEvent) {
        if (!e.repeat) {
            switch (e.key) {
                case "g":
                    this.solve();
                    break;
                case "r":
                    this.reset();
            }
        }
    }

    onCheckboxChange(e: Event) {
        this.#game.uniqueRowsAndColumns = (<HTMLInputElement>e.target).checked;
    }

    reset() {
        this.#game.reset();
    }

    solve() {
        let gameSolver = new GameSolver();
        gameSolver.game = this.#game;
        gameSolver.solveFull();
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
