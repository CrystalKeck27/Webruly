interface SolverMove extends Move {
    isGuess: boolean;
    isGiven: boolean;
}

// noinspection DuplicatedCode
class GameSolver {
    #game: Game;
    #moves: Move[];
    #colData: {PRIMARY: number, SECONDARY: number}[];
    #rowData: {PRIMARY: number, SECONDARY: number}[];

    initRowAndColData() {
        this.#colData = [];
        this.#rowData = [];
        for (let x = 0; x < this.width; x++) {
            this.#colData[x] = {PRIMARY: 0, SECONDARY: 0};
        }
        for (let y = 0; y < this.height; y++) {
            this.#rowData[y] = {PRIMARY: 0, SECONDARY: 0};
            for (let x = 0; x < this.width; x++) {
                switch(this.#game.getCellState({x:x, y:y})) {
                    case CellState.PRIMARY:
                        this.#rowData[y].PRIMARY++;
                        this.#colData[x].PRIMARY++;
                        break;
                    case CellState.SECONDARY:
                        this.#rowData[y].SECONDARY++;
                        this.#colData[x].SECONDARY++;
                }
            }
        }
    }

    solveFull() {
        this.initRowAndColData();
    }
    
    oaoSingle(): Move | null {
        for (let y = 0; y < this.height; y++) {
            let row = this.#rowData[y];
            if(row.PRIMARY + row.SECONDARY == this.width - 1) {
                let emptyX = -1;
                for (let x = 0; x < this.width; x++) {
                    if(this.#game.getCellState({x:x, y:y}) == CellState.EMPTY) {
                        emptyX = x;
                        break;
                    }
                }
                if(row.PRIMARY == this.width / 2) {
                    return {x:emptyX, y:y, state:CellState.SECONDARY};
                } else {
                    return {x:emptyX, y:y, state:CellState.PRIMARY};
                }
            }

        }
        for (let x = 0; x < this.width; x++) {
            let col = this.#colData[x];
            if(col.PRIMARY + col.SECONDARY == this.height - 1) {
                let emptyY = -1;
                for (let y = 0; y < this.height; y++) {
                    if(this.#game.getCellState({x:x, y:y}) == CellState.EMPTY) {
                        emptyY = y;
                        break;
                    }
                }
                if(col.PRIMARY == this.height / 2) {
                    return {x:x, y:emptyY, state:CellState.SECONDARY};
                } else {
                    return {x:x, y:emptyY, state:CellState.PRIMARY};
                }
            }
        }
    }

    makeMove(move: Move) {
        this.#moves.push(move);
        this.#game.setCellState(move);
    }

    set game(game) {
        this.#game = game;
    }

    get game() {
        return this.#game;
    }

    get width(): number {
        return this.#game.width;
    }

    get height(): number {
        return this.#game.height;
    }
}