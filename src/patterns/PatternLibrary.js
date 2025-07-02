class PatternLibrary {
    static getAllPatterns() {
        return {
            glider: {
                name: 'Planeador',
                description: 'Un patrón que se mueve diagonalmente',
                pattern: [
                    [0, 1, 0],
                    [0, 0, 1],
                    [1, 1, 1]
                ]
            },
            
            blinker: {
                name: 'Parpadeo',
                description: 'Oscilador simple de periodo 2',
                pattern: [
                    [1, 1, 1]
                ]
            },
            
            block: {
                name: 'Bloque',
                description: 'Patrón estático que nunca cambia',
                pattern: [
                    [1, 1],
                    [1, 1]
                ]
            },
            
            beacon: {
                name: 'Faro',
                description: 'Oscilador de periodo 2',
                pattern: [
                    [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 1, 1],
                    [0, 0, 1, 1]
                ]
            },
            
            toad: {
                name: 'Sapo',
                description: 'Oscilador de periodo 2',
                pattern: [
                    [0, 1, 1, 1],
                    [1, 1, 1, 0]
                ]
            },
            
            pulsar: {
                name: 'Pulsar',
                description: 'Oscilador de periodo 3',
                pattern: [
                    [0,0,1,1,1,0,0,0,1,1,1,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,1,0,1,0,0,0,0,1],
                    [1,0,0,0,0,1,0,1,0,0,0,0,1],
                    [1,0,0,0,0,1,0,1,0,0,0,0,1],
                    [0,0,1,1,1,0,0,0,1,1,1,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,1,1,1,0,0,0,1,1,1,0,0],
                    [1,0,0,0,0,1,0,1,0,0,0,0,1],
                    [1,0,0,0,0,1,0,1,0,0,0,0,1],
                    [1,0,0,0,0,1,0,1,0,0,0,0,1],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,1,1,1,0,0,0,1,1,1,0,0]
                ]
            },
            
            gosper: {
                name: 'Cañón de Gosper',
                description: 'Genera planeadores infinitamente',
                pattern: [
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                    [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                ]
            }
        };
    }

    /**
     * Get a patter by name
     */
    static getPattern(name) {
        const patterns = this.getAllPatterns();
        return patterns[name] || null;
    }

    /**
     * Get patter array by name
     */
    static getPatternArray(name) {
        const pattern = this.getPattern(name);
        return pattern ? pattern.pattern : null;
    }

    /**
     * Get all pattern names
     */
    static getPatternNames() {
        return Object.keys(this.getAllPatterns());
    }

    /**
     * Check if a pattern exists
     */
    static hasPattern(name) {
        return this.getPattern(name) !== null;
    }
}