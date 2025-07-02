class GameRules {
    /**
     * Determina si una celda debe estar viva en la siguiente generación
     * @param {boolean} currentState - Estado actual de la celda
     * @param {number} neighbors - Número de vecinos vivos
     * @returns {boolean} - Nuevo estado de la celda
     */
    static getNextState(currentState, neighbors) {
        if (currentState) {
            // Célula viva
            // Sobrevive con 2 o 3 vecinos
            return neighbors === 2 || neighbors === 3;
        } else {
            // Célula muerta
            // Nace con exactamente 3 vecinos
            return neighbors === 3;
        }
    }

    /**
     * Aplica las reglas a toda la cuadrícula para generar el siguiente estado
     * @param {Grid} grid - La cuadrícula actual
     * @returns {Array} - Nuevo estado de la cuadrícula
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
     * Verifica si el estado de la cuadrícula ha cambiado
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