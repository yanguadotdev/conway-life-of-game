class SimulationController {
    constructor(grid) {
        this.grid = grid;
        this.isRunning = false;
        this.generation = 0;
        this.speed = 200; // milisegundos
        this.intervalId = null;
        this.previousState = null;
        this.listeners = {
            generationChange: [],
            stateChange: []
        };
    }

    /**
     * Inicia la simulación
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
     * Pausa la simulación
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
     * Alterna entre iniciar y pausar
     */
    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    /**
     * Detiene y reinicia la simulación
     */
    stop() {
        this.pause();
        this.generation = 0;
        this.previousState = null;
        this.notifyGenerationChange();
        this.notifyStateChange('stopped');
    }

    /**
     * Ejecuta una sola generación
     */
    nextGeneration() {
        const currentState = this.grid.getGridState();
        const newState = GameRules.evolveGrid(this.grid);
        
        // Verificar si hay cambios
        if (!GameRules.hasChanged(currentState, newState)) {
            this.pause(); // Auto-pausa si no hay cambios
            return;
        }
        
        this.grid.setGridState(newState);
        this.generation++;
        this.previousState = currentState;
        
        this.notifyGenerationChange();
    }

    /**
     * Establece la velocidad de la simulación
     */
    setSpeed(speed) {
        this.speed = speed;
        if (this.isRunning) {
            this.pause();
            this.start();
        }
    }

    /**
     * Obtiene el estado actual de la simulación
     */
    getState() {
        return {
            isRunning: this.isRunning,
            generation: this.generation,
            speed: this.speed
        };
    }

    /**
     * Agrega un listener para cambios de generación
     */
    onGenerationChange(callback) {
        this.listeners.generationChange.push(callback);
    }

    /**
     * Agrega un listener para cambios de estado
     */
    onStateChange(callback) {
        this.listeners.stateChange.push(callback);
    }

    /**
     * Notifica cambios de generación
     */
    notifyGenerationChange() {
        this.listeners.generationChange.forEach(callback => {
            callback(this.generation);
        });
    }

    /**
     * Notifica cambios de estado
     */
    notifyStateChange(state) {
        this.listeners.stateChange.forEach(callback => {
            callback(state, this.isRunning);
        });
    }
}