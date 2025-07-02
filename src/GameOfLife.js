/**
 * Main class of Game of Life
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

    init() {
        // Create the grid
        this.grid = new Grid(100, 100);
        
        // Create the simulation controller
        this.simulation = new SimulationController(this.grid);
        
        // Create the pattern loader
        this.patternLoader = new PatternLoader(this.grid);
        
        // Create the UI controller
        this.uiController = new UIController(this.grid, this.simulation, this.patternLoader);
        
        // Render the game
        this.render();
        
        // Setup events
        this.setupEvents();
    }

    /**
     * Render the game in the DOM
     */
    render() {
        const container = $(this.containerSelector);
        if (!container) return

        const gridContainer = $('.grid-container', container);
        const oldGrid = $('.grid', gridContainer);
        const newGrid = this.grid.createElement();
        gridContainer.replaceChild(newGrid, oldGrid);
    }

    /**
     * Setup events of game
     */
    setupEvents() {
        // Events are handled in UIController
        this.uiController.bindEvents();
    }

    getGrid() {
        return this.grid;
    }

    getSimulation() {
        return this.simulation;
    }

    getPatternLoader() {
        return this.patternLoader;
    }

    /**
     * Reset the game
     */
    reset() {
        this.simulation.stop();
        this.grid.clear();
    }

    /**
     * Destroy the game and clean resources
     */
    destroy() {
        if (this.simulation) {
            this.simulation.pause();
        }
        
        if (this.uiController) {
            this.uiController.unbindEvents();
        }

        const container = $(this.containerSelector);
        if (container) {
            container.innerHTML = '';
        }
    }
}