/**
 * Controller for the UI
 */
class UIController {
    constructor(grid, simulation, patternLoader) {
        this.grid = grid;
        this.simulation = simulation;
        this.patternLoader = patternLoader;

        // DOM elements
        this.playButton = null;
        this.clearButton = null;
        this.patternSelect = null;
        this.speedRange = null;
        this.generationCounter = null;

        // State
        this.isDrawing = false;
        this.selectedPattern = null;

        this.initElements();
        this.setupSimulationListeners();
        this.updatePatternSelect();
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        this.playButton = $('#playBtn');
        this.clearButton = $('#clearBtn');
        this.patternSelect = $('#patternSelect');
        this.speedRange = $('#speedRange');
        this.generationCounter = $('#generationCount');
    }

    /**
     * Setup simulation listeners
     */
    setupSimulationListeners() {
        // Listener for generation changes
        this.simulation.onGenerationChange((generation) => {
            this.updateGenerationCounter(generation);
        });

        // Listener for simulation state changes
        this.simulation.onStateChange((state, isRunning) => {
            this.updatePlayButton(isRunning);
        });
    }

    /**
     * Bind all UI events
     */
    bindEvents() {
        this.bindControlEvents();
        this.bindGridEvents();
        this.bindKeyboardEvents();
    }

    /**
     * Bind control events
     */
    bindControlEvents() {
        // Botón play/pause
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                this.simulation.toggle();
            });
        }

        // Botón clear
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.simulation.stop();
                this.grid.clear();
            });
        }

        // Pattern selector
        if (this.patternSelect) {
            this.patternSelect.addEventListener('change', (e) => {
                this.selectedPattern = e.target.value;
                if (this.selectedPattern) {
                    this.patternLoader.loadPattern(this.selectedPattern);
                }
            });
        }

        // Speed control
        if (this.speedRange) {
            this.speedRange.addEventListener('input', (e) => {
                const speed = parseInt(e.target.value);
                this.simulation.setSpeed(speed);
            });
        }
    }

    /**
     * Bind grid events
     */
    bindGridEvents() {
        const gridElement = this.grid.element;
        if (!gridElement) return;

        // Click on cells
        gridElement.addEventListener('click', e => {
            this.handleCellClick(e);
        });

        // Drag to draw
        gridElement.addEventListener('mousedown', e => {
            this.isDrawing = true;
        });

        gridElement.addEventListener('mousemove', e => {
            if (this.isDrawing) {
                this.handleCellHover(e);
            }
        });

        gridElement.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        // Prevent text selection while dragging
        gridElement.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Bind keyboard events
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.simulation.toggle();
                    break;
                case 'KeyC':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.simulation.stop();
                        this.grid.clear();
                    }
                    break;
                case 'KeyR':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.grid.clear();
                        if (this.selectedPattern) {
                            this.patternLoader.loadPattern(this.selectedPattern);
                        }
                    }
                    break;
            }
        });
    }

    /**
     * Handle cell clicks
     */
    handleCellClick(e) {
        const cellElement = e.target;
        if (!cellElement.classList.contains('cell')) return;

        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);

        if (this.selectedPattern && this.selectedPattern !== '') {
            // Load pattern at clicked position
            this.patternLoader.loadPatternAt(this.selectedPattern, row, col, false);
        } else {
            // Toggle cell state
            this.grid.toggleCell(row, col);
        }
    }

    /**
     * Handle cell hover while dragging
     */
    handleCellHover(e) {
        const cellElement = e.target;
        if (!cellElement.classList.contains('cell')) return;

        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);

        // Only draw if not there is a pattern selected
        if (!this.selectedPattern || this.selectedPattern === '') {
            this.grid.setCellState(row, col, true);
        }
    }

    /**
     * Update play button
     */
    updatePlayButton(isRunning) {
        if (this.playButton) {
            this.playButton.textContent = isRunning ? '⏸ Pause' : '▶ Play';
        }
    }

    /**
     * Update generation counter
     */
    updateGenerationCounter(generation) {
        if (this.generationCounter) {
            this.generationCounter.textContent = generation;
        }
    }

    /**
     * Update pattern select
     */
    updatePatternSelect() {
        if (!this.patternSelect) return;

        // Add available patterns
        const patterns = this.patternLoader.getAvailablePatterns();
        patterns.forEach(patternName => {
            const patternInfo = this.patternLoader.getPatternInfo(patternName);
            const option = document.createElement('option');
            option.value = patternName;
            option.textContent = patternInfo.name;
            this.patternSelect.appendChild(option);
        });
    }

    /**
     * Get game stats
     */
    getGameStats() {
        const gridState = this.grid.getGridState();
        let aliveCells = 0;

        for (let row = 0; row < gridState.length; row++) {
            for (let col = 0; col < gridState[row].length; col++) {
                if (gridState[row][col]) {
                    aliveCells++;
                }
            }
        }

        return {
            generation: this.simulation.generation,
            aliveCells: aliveCells,
            totalCells: this.grid.rows * this.grid.cols,
            isRunning: this.simulation.isRunning,
            speed: this.simulation.speed
        };
    }

    /**
     * Unbind all events
     */
    unbindEvents() {
        // Remove control listeners
        if (this.playButton) {
            this.playButton.replaceWith(this.playButton.cloneNode(true));
        }
        if (this.clearButton) {
            this.clearButton.replaceWith(this.clearButton.cloneNode(true));
        }
        if (this.patternSelect) {
            this.patternSelect.replaceWith(this.patternSelect.cloneNode(true));
        }
        if (this.speedRange) {
            this.speedRange.replaceWith(this.speedRange.cloneNode(true));
        }

        if (this.grid.element) {
            this.grid.element.replaceWith(this.grid.element.cloneNode(true));
        }
    }
}