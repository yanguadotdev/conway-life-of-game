/**
 * Punto de entrada principal del Juego de la Vida de Conway
 * Inicializa la aplicación cuando el DOM está listo
 */

// Variable global para la instancia del juego
let gameOfLife = null;

/**
 * Inicializa el juego
 */
function initGame() {
    try {
        // Crear instancia del juego
        gameOfLife = new GameOfLife('.container');
        
    } catch (error) {
        console.error('Error al inicializar el juego:', error);
        showErrorMessage('Error al inicializar el juego. Por favor, recarga la página.');
    }
}

/**
 * Muestra un mensaje de error al usuario
 */
function showErrorMessage(message) {
    // Crear elemento de error si no existe
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Work Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
        `;
        document.body.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Ocultar después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.display = 'none';
        }
    }, 5000);
}

/**
 * Función debounce para optimizar eventos frecuentes
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Funciones de utilidad para desarrollo/debugging
 */
window.gameUtils = {
    /**
     * Obtiene estadísticas del juego actual
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
     * Carga un patrón aleatorio
     */
    loadRandomPattern: () => {
        if (!gameOfLife) return;
        const patternLoader = gameOfLife.getPatternLoader();
        patternLoader.loadRandomPattern();
    },

    /**
     * Exporta el estado actual como JSON
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
     * Importa un estado desde JSON
     */
    importState: (jsonString) => {
        if (!gameOfLife) return false;
        try {
            const data = JSON.parse(jsonString);
            const grid = gameOfLife.getGrid();
            const simulation = gameOfLife.getSimulation();
            
            simulation.pause();
            grid.setGridState(data.state);
            
            console.log('Estado importado exitosamente');
            return true;
        } catch (error) {
            console.error('Error al importar estado:', error);
            return false;
        }
    },

    /**
     * Pausa/reanuda la simulación
     */
    toggle: () => {
        if (!gameOfLife) return;
        gameOfLife.getSimulation().toggle();
    },

    /**
     * Reinicia el juego completamente
     */
    reset: () => {
        if (!gameOfLife) return;
        gameOfLife.reset();
        console.log('Juego reiniciado');
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM ya está listo
    initGame();
}

// Exportar para uso global
window.gameOfLife = gameOfLife;