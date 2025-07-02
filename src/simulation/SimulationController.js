class SimulationController {
    constructor(grid) {
        this.grid = grid;
        this.isRunning = false;
        this.generation = 0;
        this.speed = 200; // miliseconds
        this.intervalId = null;
        this.previousState = null;
        this.listeners = {
            generationChange: [],
            stateChange: []
        };
    }

    /**
     * Start the simulation
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.nextGeneration();
        }, this.speed);

        this.notifyStateChange('started');
    }

    /**
     * Pause the simulation
     */
    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.notifyStateChange('paused');
    }

    /**
     * Toggle between start and pause
     */
    toggle() {
        this.isRunning
            ? this.pause()
            : this.start();
    }

    /**
     * Stop and reset the simulation
     */
    stop() {
        this.pause();
        this.generation = 0;
        this.previousState = null;
        this.notifyGenerationChange();
        this.notifyStateChange('stopped');
    }

    /**
     * Execute a single generation
     */
    nextGeneration() {
        const currentState = this.grid.getGridState();
        const newState = GameRules.evolveGrid(this.grid);

        // Verify if the grid state has changed
        if (!GameRules.hasChanged(currentState, newState)) {
            this.pause();
            return;
        }

        this.grid.setGridState(newState);
        this.generation++;
        this.previousState = currentState;

        this.notifyGenerationChange();
    }

    /**
     * Set the simulation speed
     */
    setSpeed(speed) {
        this.speed = speed;
        if (this.isRunning) {
            this.pause();
            this.start();
        }
    }

    /**
     * Get the current state of the simulation
     */
    getState() {
        return {
            isRunning: this.isRunning,
            generation: this.generation,
            speed: this.speed
        };
    }

    /**
     * Add a listeners for generation changes
     */
    onGenerationChange(callback) {
        this.listeners.generationChange.push(callback);
    }

    /**
     * Add a listener for state changes
     */
    onStateChange(callback) {
        this.listeners.stateChange.push(callback);
    }

    /**
     * Notify generation changes
     */
    notifyGenerationChange() {
        this.listeners.generationChange.forEach(callback => {
            callback(this.generation);
        });
    }

    /**
     * Notify state changes
     */
    notifyStateChange(state) {
        this.listeners.stateChange.forEach(callback => {
            callback(state, this.isRunning);
        });
    }
}