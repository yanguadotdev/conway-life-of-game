/**
 * Controller to load patterns in the grid
 */
class PatternLoader {
    constructor(grid) {
        this.grid = grid;
    }

    /**
     * Load a pattern in the grid
     * @param {string} patternName - Pattern name
     * @param {number} startRow - Start row (optional)
     * @param {number} startCol - Start column (optional)
     * @param {boolean} clearGrid - Clear grid before (optional)
     */
    loadPattern(patternName, startRow = null, startCol = null, clearGrid = true) {
        const pattern = PatternLibrary.getPatternArray(patternName);
        
        if (!pattern) return

        // Clear grid if requested
        if (clearGrid) {
            this.grid.clear();
        }

        // Calculate center position if not specified
        if (startRow === null || startCol === null) {
            startRow = Math.floor((this.grid.rows - pattern.length) / 2);
            startCol = Math.floor((this.grid.cols - pattern[0].length) / 2);
        }

        // Ensure the pattern fits in the grid
        if (!this.canFitPattern(pattern, startRow, startCol)) {
            showMessage(`Pattern '${patternName}' does not fit in the specified position`, { type: 'warning' });
            return false;
        }

        // Load the pattern
        this.setPattern(pattern, startRow, startCol);
        
        return true;
    }

    /**
     * Set a pattern in the grid
     * @param {Array} pattern - Array 2D of the pattern
     * @param {number} startRow - Start row
     * @param {number} startCol - Start column
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
     * Verify if the pattern can fit in the grid
     * @param {Array} pattern - Array 2D of the pattern
     * @param {number} startRow - Start row
     * @param {number} startCol - Start column
     * @returns {boolean} - True if the pattern can fit
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
     * Load a pattern at specific position by clicking
     * @param {string} patternName - Pattern name
     * @param {number} clickRow - Row where the click was made
     * @param {number} clickCol - Column where the click was made
     * @param {boolean} clearGrid - Clear grid before loading
     */
    loadPatternAt(patternName, clickRow, clickCol, clearGrid = true) {
        const pattern = PatternLibrary.getPatternArray(patternName);
        
        if (!pattern) return

        // Calculate position to center the pattern at the click point
        const startRow = clickRow - Math.floor(pattern.length / 2);
        const startCol = clickCol - Math.floor(pattern[0].length / 2);

        return this.loadPattern(patternName, startRow, startCol, clearGrid);
    }

    /**
     * Get information about a pattern
     * @param {string} patternName - Pattern name
     * @returns {Object|null} - Pattern information
     */
    getPatternInfo(patternName) {
        return PatternLibrary.getPattern(patternName);
    }

    getAvailablePatterns() {
        return PatternLibrary.getPatternNames();
    }

    /**
     * Load a random pattern
     * @param {boolean} clearGrid - Clear grid before loading
     */
    loadRandomPattern(clearGrid = true) {
        const patterns = this.getAvailablePatterns();
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        return this.loadPattern(randomPattern, null, null, clearGrid);
    }

    /**
     * Capture a pattern from the grid state
     * @param {number} startRow - Start row of the area to capture
     * @param {number} startCol - Start column of the area to capture
     * @param {number} endRow - End row of the area to capture
     * @param {number} endCol - End column of the area to capture
     * @returns {Array} - Captured pattern as 2D array
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