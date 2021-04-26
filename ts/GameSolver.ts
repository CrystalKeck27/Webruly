interface SolverMove extends Move {
    isGuess: boolean;
    isGiven: boolean;
}

// noinspection JSSuspiciousNameCombination
class GameSolver {
    #game: Game;
    #moves: SolverMove[];

    fillGivens() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let cs = this.getCellState({x: x, y: y});
                if (cs != CellState.EMPTY) {
                    this.#moves.push({x: x, y: y, state: cs, isGuess: false, isGiven: true});
                }
            }
        }
    }

    solveFull() {
        this.#moves = [];
        this.fillGivens();
        while (true) {
            let move = this.oaoSingle();
            if (move) {
                this.makeMove(move);
                if (this.hasError()) {
                    console.log("Reverting guess");
                    if (!this.switchLatestGuess()) {
                        console.log("Unsolvable");
                        return;
                    }
                }
            } else {
                if (this.isSolved()) {
                    console.log("Solved");
                    break;
                } else {
                    console.log("Making guess");
                    this.makeMove(this.makeGuess());
                }
            }
        }
    }

    oaoSingle(): SolverMove | null {
        function half(getCS: (Vector) => CellState, width: number, height: number): SolverMove | null {
            for (let y = 0; y < height; y++) {
                let empty = 0;
                let prim = 0;
                let sec = 0;
                let states: CellState[] = [];
                for (let x = 0; x < width; x++) {
                    let cs = getCS({x: x, y: y});
                    states[0] = states[1];
                    states[1] = states[2];
                    states[2] = cs;
                    if (cs == CellState.EMPTY) empty++;
                    if (cs == CellState.PRIMARY) prim++;
                    if (cs == CellState.SECONDARY) sec++;
                    if (x >= 2) {
                        for (let i = 0; i < 3; i++) {
                            if (states[i] == CellState.EMPTY &&
                                states[(i + 1) % 3] != CellState.EMPTY &&
                                states[(i + 1) % 3] == states[(i + 2) % 3]) {
                                return {
                                    x: x - (2 - i),
                                    y: y,
                                    state: states[(i + 1) % 3] == CellState.PRIMARY ? CellState.SECONDARY : CellState.PRIMARY,
                                    isGiven: false,
                                    isGuess: false
                                };
                            }
                        }
                    }
                }
                if (empty > 0) {
                    if (prim == width / 2) {
                        for (let x = 0; x < width; x++) {
                            if (getCS({x: x, y: y}) == CellState.EMPTY) {
                                return {
                                    x: x,
                                    y: y,
                                    state: CellState.SECONDARY,
                                    isGiven: false,
                                    isGuess: false
                                };
                            }
                        }
                    } else if (sec == width / 2) {
                        for (let x = 0; x < width; x++) {
                            if (getCS({x: x, y: y}) == CellState.EMPTY) {
                                return {
                                    x: x,
                                    y: y,
                                    state: CellState.PRIMARY,
                                    isGiven: false,
                                    isGuess: false
                                };
                            }
                        }
                    }
                }
            }
            return null;
        }

        // Two haves make a ~~pain in my ass~~hole
        let h = half(this.getCellState.bind(this), this.width, this.height);
        if (h) return h;
        return this.transpose(half(this.getTransposedCellState.bind(this), this.height, this.width));
    }

    hasError(): boolean {
        let self = this;
        function half(getCS: (Vector) => CellState, width: number, height: number): boolean {
            for (let y = 0; y < height; y++) {
                let prim = 0;
                let sec = 0;
                let states: CellState[] = [];
                for (let x = 0; x < width; x++) {
                    let cs = getCS({x: x, y: y});
                    states[x % 3] = cs;
                    if (cs == CellState.PRIMARY) prim++;
                    if (cs == CellState.SECONDARY) sec++;
                    if (x >= 2) {
                        if (states[0] != CellState.EMPTY &&
                            states[0] == states[1] &&
                            states[1] == states[2]) {
                            return true;
                        }
                    }
                }
                if (prim > width / 2) {
                    return true;
                }
                if (sec > width / 2) {
                    return true;
                }
                if(self.uniqueRowsAndColumns) {
                    for (let y2 = y+1; y2 < height; y2++) {
                        let isGood = false;
                        for (let x = 0; x < width; x++) {
                            let cs = getCS({x:x, y:y});
                            let cs2 = getCS({x:x, y:y2});
                            if(cs2 != cs || cs == CellState.EMPTY) {
                                isGood = true;
                            }
                        }
                        if (!isGood) return true;
                    }
                }
            }
            return false;
        }

        // Two haves make a ~~pain in my ass~~hole
        let h = half(this.getCellState.bind(this), this.width, this.height);
        if (h) return true;
        return half(this.getTransposedCellState.bind(this), this.height, this.width);
    }

    isSolved(): boolean {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let v: Vector = {x: x, y: y};
                if (this.getCellState(v) == CellState.EMPTY) {
                    return false;
                }
            }
        }
        return true;
    }

    makeGuess(): SolverMove {
        let move: SolverMove;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let v: Vector = {x: x, y: y};
                if (this.getCellState(v) == CellState.EMPTY) {
                    move = v as SolverMove;
                    move.state = CellState.PRIMARY;
                    move.isGiven = false;
                    move.isGuess = true;
                    return move;
                }
            }
        }
    }

    switchLatestGuess(): boolean {
        for (let i = this.#moves.length - 1; i >= 0; i--) {
            let move = this.#moves[i];
            if(move.isGuess) {
                move.state = move.state == CellState.PRIMARY ? CellState.SECONDARY : CellState.PRIMARY;
                move.isGuess = false;
                this.#game.setCellState(move);
                return true;
            } else {
                let moveToUndo = this.#moves.pop();
                moveToUndo.state = CellState.EMPTY;
                this.#game.setCellState(moveToUndo);
            }
        }
        return false;
    }

    getCellState(point: Vector) {
        return this.#game.getCellState(point);
    }

    getTransposedCellState(point: Vector) {
        return this.getCellState({x: point.y, y: point.x});
    }

    //Be careful with this, I'm pretty sure it actually changes the parameter.
    transpose<P extends Vector>(point: P): P {
        if (point === null) return null;
        let x = point.x;
        point.x = point.y;
        point.y = x;
        return point;
    }

    makeMove(move: SolverMove) {
        this.#moves.push(move);
        this.#game.setCellState(move);
    }

    get uniqueRowsAndColumns() {
        return this.#game.uniqueRowsAndColumns;
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
