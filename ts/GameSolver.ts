interface SolverMove extends Move {
    isGuess: boolean;
    isGiven: boolean;
}

// noinspection DuplicatedCode,JSSuspiciousNameCombination
class GameSolver {
    #game: Game;
    #moves: Move[];

    solveFull() {
    }
    
    oaoSingle(): Move | null {
        function half(getCS: (Vector) => CellState, width: number, height: number): Move | null {
            for (let y = 0; y < height; y++) {
                let emptyIdx = -1;
                let prim = 0;
                let states = [];
                for (let x = 0; x < width; x++) {
                    let cs = getCS({x:x, y:y});
                    states[0] = states[1];
                    states[1] = states[2];
                    states[2] = cs;
                    if(cs == CellState.EMPTY) {
                        if(emptyIdx == -1) {
                            emptyIdx = x;
                        } else if(emptyIdx >= 0) {
                            emptyIdx = undefined;
                        }
                    }
                    if(cs == CellState.PRIMARY) prim++;
                    if(x >= 2) {
                        
                    }
                }

            }
            return null;
        }
        // Two haves make a ~~pain in my ass~~hole
        let h = half(this.getCellState, this.width, this.height);
        if(h) return h;
        return this.transpose(half(this.getTransposedCellState, this.height, this.width));
    }

    getCellState(point: Vector) {
        return this.#game.getCellState(point);
    }

    getTransposedCellState(point: Vector) {
        return this.getCellState({x: point.y, y: point.x});
    }

    //Be careful with this, I'm pretty sure it actually changes the parameter.
    transpose<P extends Vector> (point: P): P {
        let x = point.x;
        point.x = point.y;
        point.y = x;
        return point;
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
