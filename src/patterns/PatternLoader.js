/**
 * Controlador para cargar patrones en la cuadrícula
 */
class PatternLoader {
    constructor(grid) {
        this.grid = grid;
    }

    /**
     * Carga un patrón en la cuadrícula
     * @param {string} patternName - Nombre del patrón
     * @param {number} startRow - Fila de inicio (opcional)
     * @param {number} startCol - Columna de inicio (opcional)
     * @param {boolean} clearGrid - Si debe limpiar la cuadrícula antes (opcional)
     */
    loadPattern(patternName, startRow = null, startCol = null, clearGrid = true) {
        const pattern = PatternLibrary.getPatternArray(patternName);
        
        if (!pattern) {
            console.warn(`Patrón '${patternName}' no encontrado`);
            return false;
        }

        // Limpiar cuadrícula si se solicita
        if (clearGrid) {
            this.grid.clear();
        }

        // Calcular posición de inicio centrada si no se especifica
        if (startRow === null || startCol === null) {
            startRow = Math.floor((this.grid.rows - pattern.length) / 2);
            startCol = Math.floor((this.grid.cols - pattern[0].length) / 2);
        }

        // Asegurar que el patrón cabe en la cuadrícula
        if (!this.canFitPattern(pattern, startRow, startCol)) {
            console.warn(`El patrón '${patternName}' no cabe en la posición especificada`);
            return false;
        }

        // Cargar el patrón
        this.setPattern(pattern, startRow, startCol);
        
        return true;
    }

    /**
     * Establece un patrón en la cuadrícula
     * @param {Array} pattern - Array 2D del patrón
     * @param {number} startRow - Fila de inicio
     * @param {number} startCol - Columna de inicio
     */
    setPattern(pattern, startRow, startCol) {
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                const gridRow = startRow + row;
                const gridCol = startCol + col;
                
                if (this.grid.isValidPosition(gridRow, gridCol)) {
                    const isAlive = pattern[row][col] === 1;
                    this.grid.setCellState(gridRow, gridCol, isAlive);
                }
            }
        }
    }

    /**
     * Verifica si un patrón puede caber en la posición especificada
     * @param {Array} pattern - Array 2D del patrón
     * @param {number} startRow - Fila de inicio
     * @param {number} startCol - Columna de inicio
     * @returns {boolean} - True si el patrón cabe
     */
    canFitPattern(pattern, startRow, startCol) {
        const patternHeight = pattern.length;
        const patternWidth = pattern[0].length;
        
        return (
            startRow >= 0 &&
            startCol >= 0 &&
            startRow + patternHeight <= this.grid.rows &&
            startCol + patternWidth <= this.grid.cols
        );
    }

    /**
     * Carga un patrón en una posición específica haciendo clic
     * @param {string} patternName - Nombre del patrón
     * @param {number} clickRow - Fila donde se hizo clic
     * @param {number} clickCol - Columna donde se hizo clic
     * @param {boolean} clearGrid - Si debe limpiar la cuadrícula antes
     */
    loadPatternAt(patternName, clickRow, clickCol, clearGrid = true) {
        const pattern = PatternLibrary.getPatternArray(patternName);
        
        if (!pattern) {
            console.warn(`Patrón '${patternName}' no encontrado`);
            return false;
        }

        // Calcular posición para centrar el patrón en el punto de clic
        const startRow = clickRow - Math.floor(pattern.length / 2);
        const startCol = clickCol - Math.floor(pattern[0].length / 2);

        return this.loadPattern(patternName, startRow, startCol, clearGrid);
    }

    /**
     * Obtiene información sobre un patrón
     * @param {string} patternName - Nombre del patrón
     * @returns {Object|null} - Información del patrón
     */
    getPatternInfo(patternName) {
        return PatternLibrary.getPattern(patternName);
    }

    /**
     * Obtiene todos los nombres de patrones disponibles
     * @returns {Array} - Array con los nombres de patrones
     */
    getAvailablePatterns() {
        return PatternLibrary.getPatternNames();
    }

    /**
     * Carga un patrón aleatorio
     * @param {boolean} clearGrid - Si debe limpiar la cuadrícula antes
     */
    loadRandomPattern(clearGrid = true) {
        const patterns = this.getAvailablePatterns();
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        return this.loadPattern(randomPattern, null, null, clearGrid);
    }

    /**
     * Crea un patrón personalizado desde el estado actual de la cuadrícula
     * @param {number} startRow - Fila de inicio del área a capturar
     * @param {number} startCol - Columna de inicio del área a capturar
     * @param {number} endRow - Fila final del área a capturar
     * @param {number} endCol - Columna final del área a capturar
     * @returns {Array} - Patrón capturado como array 2D
     */
    capturePattern(startRow, startCol, endRow, endCol) {
        const pattern = [];
        
        for (let row = startRow; row <= endRow; row++) {
            const patternRow = [];
            for (let col = startCol; col <= endCol; col++) {
                const cell = this.grid.getCell(row, col);
                patternRow.push(cell && cell.getState() ? 1 : 0);
            }
            pattern.push(patternRow);
        }
        
        return pattern;
    }
}