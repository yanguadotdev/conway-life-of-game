/**
 * Game Rules
 * 
 * 1. Any live cell with two or three live neighbors survives.
 * 2. Any dead cell with three live neighbors becomes a live cell.
 * 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
 */


class GameRules {
    /**
     * Determine if a cell should be alive in the next generation
     * @param {boolean} currentState - Current state of the cell
     * @param {number} neighbors - Number of neighbors alive
     * @returns {boolean} - New state of the cell
     */
    static getNextState(currentState, neighbors) {
        if (currentState) {
            return neighbors === 2 || neighbors === 3;
        } else {
            return neighbors === 3;
        }
    }

    /**
     * Apply the rules to the grid to generate the next generation
     * @param {Grid} grid - The grid to apply the rules
     * @returns {Array} - New state of the grid
     */
    static evolveGrid(grid) {
        const newState = [];
        
        for (let row = 0; row < grid.rows; row++) {
            newState[row] = [];
            for (let col = 0; col < grid.cols; col++) {
                const currentCell = grid.getCell(row, col);
                const neighbors = grid.countNeighbors(row, col);
                const currentState = currentCell.getState();
                
                newState[row][col] = this.getNextState(currentState, neighbors);
            }
        }
        
        return newState;
    }

    /**
     * Verify if the grid state has changed
     */
    static hasChanged(oldState, newState) {
        if (!oldState || !newState) return true;
        
        for (let row = 0; row < oldState.length; row++) {
            for (let col = 0; col < oldState[row].length; col++) {
                if (oldState[row][col] !== newState[row][col]) {
                    return true;
                }
            }
        }
        return false;
    }
}