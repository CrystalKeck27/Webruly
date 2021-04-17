class GameRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    #game: Game;
    #theme: Theme;

    constructor(canvasId) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.#theme = Themes.default;
    }

    render(): void {
        this.renderBackground();
        this.renderCells();
        this.renderGridlines();
    }

    private renderBackground(): void {
        this.context.save();

        this.context.resetTransform();
        this.context.fillStyle = this.#theme.background;

        this.context.fillRect(0, 0, this.width, this.height);

        this.context.restore();
    }

    private renderCells(): void {
        this.context.save();

        this.context.resetTransform();
        let cellSize = Math.min(this.width / this.#game.width, this.height / this.#game.height);

        for (let y = 0; y < this.#game.height; y++) {
            for (let x = 0; x < this.#game.width; x++) {
                let fillStyle: string;
                switch (this.#game.getCellState({x:x, y:y})) {
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

    private renderGridlines(): void {
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

    get cellSize(): number {
        return Math.min(this.width / this.#game.width, this.height / this.#game.height);
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
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