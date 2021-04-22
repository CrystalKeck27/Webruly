class EventEmitter {
    constructor() {
        this.#listeners = {};
    }
    //Giving this a type is really freakin' hard.
    #listeners;
    removeAllListeners(event) {
        this.#listeners[event] = [];
        return this;
    }
    ;
    on(event, listener) {
        if (!this.#listeners[event])
            this.#listeners[event] = [];
        this.#listeners[event].push(listener);
        return this;
    }
    ;
    off(event, listener) {
        if (!this.#listeners[event])
            this.#listeners[event] = [];
        while (true) {
            let index = this.#listeners[event].indexOf(listener);
            if (index == -1)
                break;
            this.#listeners[event].splice(index, 1);
        }
        return this;
    }
    ;
    emit(event, ...args) {
        if (!this.#listeners[event])
            this.#listeners[event] = [];
        for (const listener of this.#listeners[event]) {
            listener(...args);
        }
        return true;
    }
    ;
}
///<reference path="EventEmitter.ts"/>
class Game extends EventEmitter {
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
    #width;
    #height;
    #board;
    setCellState(move) {
        this.#board[move.y][move.x] = move.state;
        this.emit("boardStateChange");
    }
    getCellState(point) {
        return this.#board[point.y][point.x];
    }
    get width() {
        return this.#width;
    }
    get height() {
        return this.#height;
    }
}
var CellState;
(function (CellState) {
    CellState[CellState["EMPTY"] = 0] = "EMPTY";
    CellState[CellState["PRIMARY"] = 1] = "PRIMARY";
    CellState[CellState["SECONDARY"] = 2] = "SECONDARY";
})(CellState || (CellState = {}));
class GameInput {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.addEventListener("click", this.onPrimary.bind(this));
        this.canvas.addEventListener("contextmenu", this.onCtxMenu.bind(this));
        document.addEventListener("keydown", this.onKeyPress.bind(this));
    }
    #game;
    onPrimary(e) {
        this.onClick(e, 1);
    }
    onCtxMenu(e) {
        e.preventDefault();
        this.onClick(e, 2);
        return false;
    }
    onClick(e, offset) {
        let point = this.cellAt(e.offsetX, e.offsetY);
        let newState = (game.getCellState(point) + offset) % 3;
        let move = {
            x: point.x,
            y: point.y,
            state: newState
        };
        this.#game.setCellState(move);
    }
    onKeyPress(e) {
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
    cellAt(x, y) {
        return {
            x: Math.floor((x * this.#game.width) / this.width),
            y: Math.floor((y * this.#game.height) / this.height)
        };
    }
}
class GameRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.#theme = Themes.default;
    }
    #game;
    #theme;
    render() {
        this.renderBackground();
        this.renderCells();
        this.renderGridlines();
    }
    renderBackground() {
        this.context.save();
        this.context.resetTransform();
        this.context.fillStyle = this.#theme.background;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }
    renderCells() {
        this.context.save();
        this.context.resetTransform();
        let cellSize = Math.min(this.width / this.#game.width, this.height / this.#game.height);
        for (let y = 0; y < this.#game.height; y++) {
            for (let x = 0; x < this.#game.width; x++) {
                let fillStyle;
                switch (this.#game.getCellState({ x: x, y: y })) {
                    case CellState.PRIMARY:
                        fillStyle = this.#theme.primary;
                        break;
                    case CellState.SECONDARY:
                        fillStyle = this.#theme.secondary;
                        break;
                    default:
                        fillStyle = this.#theme.background;
                        //continue; ?
                        break;
                }
                this.context.fillStyle = fillStyle;
                this.context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
        this.context.restore();
    }
    renderGridlines() {
        this.context.save();
        this.context.resetTransform();
        this.context.strokeStyle = this.#theme.gridlines;
        let cellSize = this.cellSize;
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
    gameStateChange() {
        this.render();
    }
    get cellSize() {
        return Math.min(this.width / this.#game.width, this.height / this.#game.height);
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    set game(game) {
        this.#game = game;
        this.#game.on("boardStateChange", this.gameStateChange.bind(this));
    }
    get game() {
        return this.#game;
    }
}
// noinspection JSSuspiciousNameCombination
class GameSolver {
    #game;
    #moves;
    solveFull() {
    }
    oaoSingle() {
        function half(getCS, width, height) {
            for (let y = 0; y < height; y++) {
                let emptyIdx = -1;
                let prim = 0;
                let states = [];
                for (let x = 0; x < width; x++) {
                    let cs = getCS({ x: x, y: y });
                    states[0] = states[1];
                    states[1] = states[2];
                    states[2] = cs;
                    if (cs == CellState.EMPTY) {
                        if (emptyIdx == -1) {
                            emptyIdx = x;
                        }
                        else if (emptyIdx >= 0) {
                            emptyIdx = undefined;
                        }
                    }
                    if (cs == CellState.PRIMARY)
                        prim++;
                    if (x >= 2) {
                        for (let i = 0; i < 3; i++) {
                            if (states[i] == CellState.EMPTY &&
                                states[(i + 1) % 3] != CellState.EMPTY &&
                                states[(i + 1) % 3] == states[(i + 2) % 3]) {
                                return {
                                    x: x - (2 - i),
                                    y: y,
                                    state: states[(i + 1) % 3] == CellState.PRIMARY ? CellState.SECONDARY : CellState.PRIMARY
                                };
                            }
                        }
                    }
                }
                if (emptyIdx >= 0) {
                    return {
                        x: emptyIdx,
                        y: y,
                        state: prim == width / 2 ? CellState.SECONDARY : CellState.PRIMARY
                    };
                }
            }
            return null;
        }
        // Two haves make a ~~pain in my ass~~hole
        let h = half(this.getCellState.bind(this), this.width, this.height);
        if (h)
            return h;
        return this.transpose(half(this.getTransposedCellState.bind(this), this.height, this.width));
    }
    getCellState(point) {
        return this.#game.getCellState(point);
    }
    getTransposedCellState(point) {
        return this.getCellState({ x: point.y, y: point.x });
    }
    //Be careful with this, I'm pretty sure it actually changes the parameter.
    transpose(point) {
        if (point === null)
            return null;
        let x = point.x;
        point.x = point.y;
        point.y = x;
        return point;
    }
    makeMove(move) {
        this.#moves.push(move);
        this.#game.setCellState(move);
    }
    set game(game) {
        this.#game = game;
    }
    get game() {
        return this.#game;
    }
    get width() {
        return this.#game.width;
    }
    get height() {
        return this.#game.height;
    }
}
let gameRenderer;
let gameInput;
let game;
// noinspection JSUnusedGlobalSymbols
function setup() {
    game = new Game(8, 8);
    gameInput = new GameInput("mainCanvas");
    gameInput.game = game;
    gameRenderer = new GameRenderer("mainCanvas");
    gameRenderer.game = game;
    gameRenderer.render();
}
const Themes = {
    default: {
        background: "#A0A0A0",
        gridlines: "#000000",
        primary: "#303030",
        secondary: "#F0F0F0"
    }
};
//# sourceMappingURL=script.js.map