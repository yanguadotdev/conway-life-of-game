/**
 * Clase principal del Juego de la Vida de Conway
 * Coordina todos los componentes del juego
 */
class GameOfLife {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
        this.grid = null;
        this.simulation = null;
        this.uiController = null;
        this.patternLoader = null;
        
        this.init();
    }

    /**
     * Inicializa el juego
     */
    init() {
        // Crear la cuadrícula
        this.grid = new Grid(30, 40);
        
        // Crear el controlador de simulación
        this.simulation = new SimulationController(this.grid);
        
        // Crear el cargador de patrones
        this.patternLoader = new PatternLoader(this.grid);
        
        // Crear el controlador de UI
        this.uiController = new UIController(this.grid, this.simulation, this.patternLoader);
        
        // Renderizar el juego
        this.render();
        
        // Configurar eventos
        this.setupEvents();
    }

    /**
     * Renderiza el juego en el DOM
     */
    render() {
        const container = document.querySelector(this.containerSelector);
        if (!container) {
            console.error('Container not found:', this.containerSelector);
            return;
        }

        // Reemplazar la cuadrícula con la del objeto Grid
        const gridContainer = container.querySelector('.grid-container');
        const oldGrid = gridContainer.querySelector('.grid');
        const newGrid = this.grid.createElement();
        gridContainer.replaceChild(newGrid, oldGrid);
    }

    /**
     * Configura los eventos del juego
     */
    setupEvents() {
        // Los eventos se manejan en UIController
        this.uiController.bindEvents();
    }

    /**
     * Obtiene la instancia del grid
     */
    getGrid() {
        return this.grid;
    }

    /**
     * Obtiene la instancia de la simulación
     */
    getSimulation() {
        return this.simulation;
    }

    /**
     * Obtiene la instancia del cargador de patrones
     */
    getPatternLoader() {
        return this.patternLoader;
    }

    /**
     * Reinicia el juego
     */
    reset() {
        this.simulation.stop();
        this.grid.clear();
    }

    /**
     * Destruye el juego y limpia recursos
     */
    destroy() {
        if (this.simulation) {
            this.simulation.pause();
        }
        
        if (this.uiController) {
            this.uiController.unbindEvents();
        }

        const container = document.querySelector(this.containerSelector);
        if (container) {
            container.innerHTML = '';
        }
    }
}