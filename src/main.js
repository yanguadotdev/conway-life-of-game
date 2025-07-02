// Global variable for the game instance
let gameOfLife = null;

/**
 * Initialize the game
 */
function initGame() {
    try {
        // Create the game instance
        gameOfLife = new GameOfLife('.container');
        
    } catch (error) {
        showMessage('Error al inicializar el juego. Por favor, recarga la página.', { type: 'error' });
    }
}


/**
 * Utility functions for development/debugging
 */
window.gameUtils = {
    /**
     * Get game statistics
     */
    getStats: () => {
        if (!gameOfLife) return null;
        
        const grid = gameOfLife.getGrid();
        const simulation = gameOfLife.getSimulation();
        const gridState = grid.getGridState();
        
        let aliveCells = 0;
        for (let row = 0; row < gridState.length; row++) {
            for (let col = 0; col < gridState[row].length; col++) {
                if (gridState[row][col]) aliveCells++;
            }
        }

        return {
            generation: simulation.generation,
            aliveCells: aliveCells,
            totalCells: grid.rows * grid.cols,
            density: (aliveCells / (grid.rows * grid.cols) * 100).toFixed(2) + '%',
            isRunning: simulation.isRunning,
            speed: simulation.speed
        };
    },

    /**
     * Load a random pattern
     */
    loadRandomPattern: () => {
        if (!gameOfLife) return;
        const patternLoader = gameOfLife.getPatternLoader();
        patternLoader.loadRandomPattern();
    },

    /**
     * Export the current state as JSON
     */
    exportState: () => {
        if (!gameOfLife) return null;
        const grid = gameOfLife.getGrid();
        return JSON.stringify({
            state: grid.getGridState(),
            generation: gameOfLife.getSimulation().generation,
            timestamp: new Date().toISOString()
        });
    },

    /**
     * Import the state from JSON
     */
    importState: (jsonString) => {
        if (!gameOfLife) return false;
        try {
            const data = JSON.parse(jsonString);
            const grid = gameOfLife.getGrid();
            const simulation = gameOfLife.getSimulation();
            
            simulation.pause();
            grid.setGridState(data.state);
            
            console.log('State imported successfully');
            return true;
        } catch (error) {
            console.error('Error importing state:', error);
            return false;
        }
    },

    /**
     * Pause/resume the simulation
     */
    toggle: () => {
        if (!gameOfLife) return;
        gameOfLife.getSimulation().toggle();
    },

    /**
     * Reset the game completely
     */
    reset: () => {
        if (!gameOfLife) return;
        gameOfLife.reset();
        console.log('Game reset');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is already ready
    initGame();
}

// Export for global use
window.gameOfLife = gameOfLife;