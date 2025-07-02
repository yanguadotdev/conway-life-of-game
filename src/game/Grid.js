class Grid {
    constructor(rows = 100, cols = 100) {
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

        const fragment = document.createDocumentFragment();

        // Create elements for cells
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellElement = this.cells[row][col].createElement();
                fragment.appendChild(cellElement);
            }
        }

        gridElement.appendChild(fragment);
        this.element = gridElement;
        return gridElement;
    }

    /**
     * Get a specific cell  
     */
    getCell(row, col) {
        if (this.isValidPosition(row, col)) {
            return this.cells[row][col];
        }
        return null;
    }

    /**
     * Verify if a position is valid
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    /**
     * Toggle the state of a cell
     */
    toggleCell(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.toggle();
        }
    }

    /**
     * Set the state of a cell
     */
    setCellState(row, col, isAlive) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.setState(isAlive);
        }
    }

    /**
     * Get the current state of all the grid
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
     * Set the state of all the grid
     */
    setGridState(state) {
        for (let row = 0; row < this.rows && row < state.length; row++) {
            for (let col = 0; col < this.cols && col < state[row].length; col++) {
                this.setCellState(row, col, state[row][col]);
            }
        }
    }

    /**
     * Clear all the grid
     */
    clear() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.setCellState(row, col, false);
            }
        }
    }

    /**
     * Count the neighbors of a cell
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