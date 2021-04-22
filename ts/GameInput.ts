class GameInput {
    canvas: HTMLCanvasElement;
    #game: Game;

    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.canvas.addEventListener("click", this.onPrimary.bind(this));
        this.canvas.addEventListener("contextmenu", this.onCtxMenu.bind(this));
        document.addEventListener("keydown", this.onKeyPress.bind(this));

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
        console.log(1)
        if (!e.repeat) {
            switch (e.key) {
                case "g":
                    let gameSolver = new GameSolver();
                    gameSolver.game = this.#game;
                    gameSolver.solveFull();
                    console.log(gameSolver.oaoSingle());
            }
        }
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
