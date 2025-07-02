/**
 * Controlador de la interfaz de usuario
 */
class UIController {
    constructor(grid, simulation, patternLoader) {
        this.grid = grid;
        this.simulation = simulation;
        this.patternLoader = patternLoader;
        
        // Referencias a elementos DOM
        this.playButton = null;
        this.clearButton = null;
        this.patternSelect = null;
        this.speedRange = null;
        this.generationCounter = null;
        
        // Estado
        this.isDrawing = false;
        this.selectedPattern = null;
        
        this.initElements();
        this.setupSimulationListeners();
    }

    /**
     * Inicializa las referencias a elementos DOM
     */
    initElements() {
        this.playButton = document.getElementById('playBtn');
        this.clearButton = document.getElementById('clearBtn');
        this.patternSelect = document.getElementById('patternSelect');
        this.speedRange = document.getElementById('speedRange');
        this.generationCounter = document.getElementById('generationCount');
    }

    /**
     * Configura los listeners de la simulación
     */
    setupSimulationListeners() {
        // Listener para cambios de generación
        this.simulation.onGenerationChange((generation) => {
            this.updateGenerationCounter(generation);
        });

        // Listener para cambios de estado de la simulación
        this.simulation.onStateChange((state, isRunning) => {
            this.updatePlayButton(isRunning);
        });
    }

    /**
     * Vincula todos los eventos de la UI
     */
    bindEvents() {
        this.bindControlEvents();
        this.bindGridEvents();
        this.bindKeyboardEvents();
    }

    /**
     * Vincula eventos de los controles
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

        // Selector de patrones
        if (this.patternSelect) {
            this.patternSelect.addEventListener('change', (e) => {
                this.selectedPattern = e.target.value;
                if (this.selectedPattern) {
                    this.patternLoader.loadPattern(this.selectedPattern);
                }
            });
        }

        // Control de velocidad
        if (this.speedRange) {
            this.speedRange.addEventListener('input', (e) => {
                const speed = parseInt(e.target.value);
                this.simulation.setSpeed(speed);
            });
        }
    }

    /**
     * Vincula eventos de la cuadrícula
     */
    bindGridEvents() {
        const gridElement = this.grid.element;
        if (!gridElement) return;

        // Click en celdas
        gridElement.addEventListener('click', (e) => {
            this.handleCellClick(e);
        });

        // Drag para dibujar
        gridElement.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.handleCellClick(e);
        });

        gridElement.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                this.handleCellHover(e);
            }
        });

        gridElement.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        // Prevenir selección de texto al arrastrar
        gridElement.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Vincula eventos de teclado
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
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
                case 'KeyN':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.simulation.nextGeneration();
                    }
                    break;
            }
        });
    }

    /**
     * Maneja clicks en celdas
     */
    handleCellClick(e) {
        const cellElement = e.target;
        if (!cellElement.classList.contains('cell')) return;

        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);

        if (this.selectedPattern && this.selectedPattern !== '') {
            // Cargar patrón en la posición clickeada
            this.patternLoader.loadPatternAt(this.selectedPattern, row, col, false);
        } else {
            // Alternar estado de la celda
            this.grid.toggleCell(row, col);
        }
    }

    /**
     * Maneja hover sobre celdas durante el drag
     */
    handleCellHover(e) {
        const cellElement = e.target;
        if (!cellElement.classList.contains('cell')) return;

        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);

        // Solo dibujar si no hay patrón seleccionado
        if (!this.selectedPattern || this.selectedPattern === '') {
            this.grid.setCellState(row, col, true);
        }
    }

    /**
     * Actualiza el botón de play
     */
    updatePlayButton(isRunning) {
        if (this.playButton) {
            this.playButton.textContent = isRunning ? '⏸ Pause' : '▶ Play';
        }
    }

    /**
     * Actualiza el contador de generaciones
     */
    updateGenerationCounter(generation) {
        if (this.generationCounter) {
            this.generationCounter.textContent = generation;
        }
    }

    /**
     * Actualiza el selector de patrones
     */
    updatePatternSelect() {
        if (!this.patternSelect) return;

        // Limpiar opciones existentes excepto la primera
        while (this.patternSelect.children.length > 1) {
            this.patternSelect.removeChild(this.patternSelect.lastChild);
        }

        // Agregar patrones disponibles
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
     * Establece el patrón seleccionado
     */
    setSelectedPattern(patternName) {
        this.selectedPattern = patternName;
        if (this.patternSelect) {
            this.patternSelect.value = patternName;
        }
    }

    /**
     * Obtiene estadísticas del juego
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
     * Desvincula todos los eventos
     */
    unbindEvents() {
        // Remover listeners de controles
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

        // Remover listeners de la cuadrícula
        if (this.grid.element) {
            this.grid.element.replaceWith(this.grid.element.cloneNode(true));
        }

        // Los listeners de teclado se mantienen a nivel documento
    }

    /**
     * Muestra información sobre controles
     */
    showControls() {
        const controls = [
            'Espacio: Play/Pause',
            'Ctrl+C: Limpiar cuadrícula',
            'Ctrl+R: Recargar patrón',
            'Ctrl+N: Siguiente generación',
            'Click: Alternar celda o colocar patrón',
            'Drag: Dibujar celdas'
        ];

        console.log('Controles disponibles:');
        controls.forEach(control => console.log('- ' + control));
    }
}