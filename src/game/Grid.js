class Grid {
    constructor(rows = 30, cols = 40) {
        this.rows = rows;
        this.cols = cols;
        this.cells = [];
        this.element = null;
        this.initGrid();
    }

    initGrid() {
        this.cells = [];
        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.cells[row][col] = new Cell(row, col);
            }
        }
    }

    createElement() {
        const gridElement = document.createElement('div');
        gridElement.className = 'grid';
        gridElement.id = 'grid';
        
        // Crear elementos de celdas
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellElement = this.cells[row][col].createElement();
                gridElement.appendChild(cellElement);
            }
        }
        
        this.element = gridElement;
        return gridElement;
    }

    /**
     * Obtiene una celda específica
     */
    getCell(row, col) {
        if (this.isValidPosition(row, col)) {
            return this.cells[row][col];
        }
        return null;
    }

    /**
     * Verifica si una posición es válida
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    /**
     * Alterna el estado de una celda
     */
    toggleCell(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.toggle();
        }
    }

    /**
     * Establece el estado de una celda
     */
    setCellState(row, col, isAlive) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.setState(isAlive);
        }
    }

    /**
     * Obtiene el estado actual de toda la cuadrícula
     */
    getGridState() {
        const state = [];
        for (let row = 0; row < this.rows; row++) {
            state[row] = [];
            for (let col = 0; col < this.cols; col++) {
                state[row][col] = this.cells[row][col].getState();
            }
        }
        return state;
    }

    /**
     * Establece el estado de toda la cuadrícula
     */
    setGridState(state) {
        for (let row = 0; row < this.rows && row < state.length; row++) {
            for (let col = 0; col < this.cols && col < state[row].length; col++) {
                this.setCellState(row, col, state[row][col]);
            }
        }
    }

    /**
     * Limpia toda la cuadrícula
     */
    clear() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.setCellState(row, col, false);
            }
        }
    }

    /**
     * Cuenta los vecinos vivos de una celda
     */
    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const newRow = row + i;
                const newCol = col + j;
                
                if (this.isValidPosition(newRow, newCol)) {
                    const cell = this.getCell(newRow, newCol);
                    if (cell && cell.getState()) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
}