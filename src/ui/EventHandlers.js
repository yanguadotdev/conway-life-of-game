/**
 * Manejadores de eventos especializados para el Juego de la Vida
 * Contiene eventos avanzados y utilidades de interacción
 */
class EventHandlers {
    constructor(grid, simulation, patternLoader, uiController) {
        this.grid = grid;
        this.simulation = simulation;
        this.patternLoader = patternLoader;
        this.uiController = uiController;
        
        // Estado para interacciones avanzadas
        this.isDragging = false;
        this.isSelecting = false;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.lastHoveredCell = null;
        this.dragMode = 'toggle'; // 'toggle', 'draw', 'erase'
        
        // Configuración de gestos
        this.touchStartTime = 0;
        this.touchStartPos = null;
        this.multiTouchActive = false;

        this.setupAdvancedEvents();
    }

    /**
     * Configura todos los manejadores de eventos avanzados
     */
    setupAdvancedEvents() {
        this.setupTouchEvents();
        this.setupSelectionEvents();
        this.setupHotkeys();
        this.setupContextMenu();
        this.setupPerformanceEvents();
    }

    /**
     * Configura eventos táctiles para dispositivos móviles
     */
    setupTouchEvents() {
        const gridElement = this.grid.element;
        if (!gridElement) return;

        // Prevenir zoom con pellizco en la cuadrícula
        gridElement.addEventListener('touchstart', (e) => {
            this.touchStartTime = Date.now();
            this.touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };

            if (e.touches.length > 1) {
                e.preventDefault(); // Prevenir zoom
                this.multiTouchActive = true;
            } else {
                this.multiTouchActive = false;
                this.handleTouchStart(e);
            }
        }, { passive: false });

        gridElement.addEventListener('touchmove', (e) => {
            if (this.multiTouchActive) {
                e.preventDefault();
                return;
            }
            this.handleTouchMove(e);
        }, { passive: false });

        gridElement.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
            this.multiTouchActive = false;
        });
    }

    /**
     * Maneja el inicio del toque
     */
    handleTouchStart(e) {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('cell')) {
            this.isDragging = true;
            this.handleCellInteraction(element, 'start');
        }
    }

    /**
     * Maneja el movimiento del toque
     */
    handleTouchMove(e) {
        if (!this.isDragging) return;

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('cell')) {
            this.handleCellInteraction(element, 'move');
        }
    }

    /**
     * Maneja el final del toque
     */
    handleTouchEnd(e) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        // Detectar toque largo (500ms)
        if (touchDuration > 500 && !this.isDragging) {
            this.handleLongPress(e);
        }
        
        this.isDragging = false;
        this.dragMode = 'toggle';
    }

    /**
     * Maneja la presión larga
     */
    handleLongPress(e) {
        // Mostrar menú contextual o información
        console.log('Presión larga detectada');
        // Aquí podrías mostrar un menú contextual móvil
    }

    /**
     * Configura eventos de selección por área
     */
    setupSelectionEvents() {
        const gridElement = this.grid.element;
        if (!gridElement) return;

        // Selección con Shift + clic
        gridElement.addEventListener('mousedown', (e) => {
            if (e.shiftKey && e.target.classList.contains('cell')) {
                e.preventDefault();
                this.startAreaSelection(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isSelecting) {
                this.updateAreaSelection(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isSelecting) {
                this.endAreaSelection(e);
            }
        });
    }

    /**
     * Inicia la selección por área
     */
    startAreaSelection(e) {
        this.isSelecting = true;
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        this.selectionStart = { row, col };
        this.selectionEnd = { row, col };
        
        this.highlightSelection();
    }

    /**
     * Actualiza la selección por área
     */
    updateAreaSelection(e) {
        if (!this.isSelecting) return;

        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (!element || !element.classList.contains('cell')) return;

        const row = parseInt(element.dataset.row);
        const col = parseInt(element.dataset.col);
        
        this.selectionEnd = { row, col };
        this.highlightSelection();
    }

    /**
     * Finaliza la selección por área
     */
    endAreaSelection(e) {
        this.isSelecting = false;
        
        if (!this.selectionStart || !this.selectionEnd) return;

        // Aplicar acción a la selección
        this.applyActionToSelection('toggle');
        
        // Limpiar selección
        this.clearSelection();
    }

    /**
     * Resalta la selección actual
     */
    highlightSelection() {
        // Limpiar selección anterior
        this.clearSelection();

        if (!this.selectionStart || !this.selectionEnd) return;

        const startRow = Math.min(this.selectionStart.row, this.selectionEnd.row);
        const endRow = Math.max(this.selectionStart.row, this.selectionEnd.row);
        const startCol = Math.min(this.selectionStart.col, this.selectionEnd.col);
        const endCol = Math.max(this.selectionStart.col, this.selectionEnd.col);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const cell = this.grid.getCell(row, col);
                if (cell && cell.element) {
                    cell.element.classList.add('selected');
                }
            }
        }
    }

    /**
     * Limpia la selección visual
     */
    clearSelection() {
        const selectedCells = document.querySelectorAll('.cell.selected');
        selectedCells.forEach(cell => cell.classList.remove('selected'));
    }

    /**
     * Aplica una acción a la selección
     */
    applyActionToSelection(action) {
        if (!this.selectionStart || !this.selectionEnd) return;

        const startRow = Math.min(this.selectionStart.row, this.selectionEnd.row);
        const endRow = Math.max(this.selectionStart.row, this.selectionEnd.row);
        const startCol = Math.min(this.selectionStart.col, this.selectionEnd.col);
        const endCol = Math.max(this.selectionStart.col, this.selectionEnd.col);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                switch (action) {
                    case 'toggle':
                        this.grid.toggleCell(row, col);
                        break;
                    case 'fill':
                        this.grid.setCellState(row, col, true);
                        break;
                    case 'clear':
                        this.grid.setCellState(row, col, false);
                        break;
                }
            }
        }
    }

    /**
     * Configura teclas de acceso rápido adicionales
     */
    setupHotkeys() {
        console.log('Hotkeys configurados');
        document.addEventListener('keydown', (e) => {
            // Solo procesar si no estamos en un input
            console.log(e.target)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            switch (e.code) {
                case 'KeyG':
                    e.preventDefault();
                    this.patternLoader.loadPattern('glider');
                    break;
                    
                case 'KeyP':
                    e.preventDefault();
                    this.patternLoader.loadPattern('pulsar');
                    break;
                    
                case 'KeyB':
                    e.preventDefault();
                    this.patternLoader.loadPattern('beacon');
                    break;
                    
                case 'KeyT':
                    e.preventDefault();
                    this.patternLoader.loadPattern('toad');
                    break;
                    
                case 'KeyF':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                    
                case 'H':
                    e.preventDefault();
                    this.showHelp();
                    break;
                    
                case 'KeyS':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.saveCurrentState();
                    }
                    break;
                    
                case 'KeyL':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.loadState();
                    }
                    break;
                    
                case 'Escape':
                    this.clearSelection();
                    break;
                    
                case 'Delete':
                case 'Backspace':
                    if (this.isSelecting || this.selectionStart) {
                        e.preventDefault();
                        this.applyActionToSelection('clear');
                        this.clearSelection();
                    }
                    break;
            }
        });
    }

    /**
     * Configura menú contextual personalizado
     */
    setupContextMenu() {
        const gridElement = this.grid.element;
        if (!gridElement) return;

        gridElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.showContextMenu(e.clientX, e.clientY, row, col);
            }
        });
    }

    /**
     * Muestra menú contextual
     */
    showContextMenu(x, y, row, col) {
        // Remover menú existente
        const existingMenu = document.getElementById('context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 8px 0;
            z-index: 1000;
            min-width: 150px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        const menuItems = [
            { text: 'Alternar celda', action: () => this.grid.toggleCell(row, col) },
            { text: 'Llenar área', action: () => this.grid.setCellState(row, col, true) },
            { text: 'Limpiar área', action: () => this.grid.setCellState(row, col, false) },
            { text: '---', action: null },
            { text: 'Planeador aquí', action: () => this.patternLoader.loadPatternAt('glider', row, col, false) },
            { text: 'Pulsar aquí', action: () => this.patternLoader.loadPatternAt('pulsar', row, col, false) }
        ];

        menuItems.forEach(item => {
            if (item.text === '---') {
                const separator = document.createElement('div');
                separator.style.cssText = 'height: 1px; background: #444; margin: 4px 0;';
                menu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.text;
                menuItem.style.cssText = `
                    padding: 8px 16px;
                    cursor: pointer;
                    color: #fff;
                    font-family: 'Work Sans', sans-serif;
                    font-size: 14px;
                `;
                
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.background = '#444';
                });
                
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.background = 'transparent';
                });
                
                menuItem.addEventListener('click', () => {
                    if (item.action) item.action();
                    menu.remove();
                });
                
                menu.appendChild(menuItem);
            }
        });

        document.body.appendChild(menu);

        // Remover menú al hacer clic fuera
        setTimeout(() => {
            document.addEventListener('click', () => {
                if (menu.parentNode) {
                    menu.remove();
                }
            }, { once: true });
        }, 100);
    }

    /**
     * Configura eventos de rendimiento
     */
    setupPerformanceEvents() {
        // Throttle para eventos de mousemove durante drag
        let mouseMoveThrottle = null;
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && !mouseMoveThrottle) {
                mouseMoveThrottle = setTimeout(() => {
                    mouseMoveThrottle = null;
                }, 16); // ~60fps
            }
        });
    }

    /**
     * Maneja interacciones con celdas
     */
    handleCellInteraction(cellElement, phase) {
        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);
        const cell = this.grid.getCell(row, col);
        
        if (!cell) return;

        if (phase === 'start') {
            // Determinar modo de drag basado en el estado inicial
            this.dragMode = cell.getState() ? 'erase' : 'draw';
        }

        // Aplicar acción según el modo
        switch (this.dragMode) {
            case 'draw':
                this.grid.setCellState(row, col, true);
                break;
            case 'erase':
                this.grid.setCellState(row, col, false);
                break;
            case 'toggle':
            default:
                this.grid.toggleCell(row, col);
                break;
        }
    }

    /**
     * Alterna pantalla completa
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error al entrar en pantalla completa:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Muestra ayuda
     */
    showHelp() {
        const helpContent = `
🎮 JUEGO DE LA VIDA DE CONWAY - AYUDA

🖱️  CONTROLES DEL RATÓN:
• Clic: Alternar celda individual
• Drag: Dibujar múltiples celdas
• Shift + Drag: Seleccionar área
• Clic derecho: Menú contextual

⌨️  ATAJOS DE TECLADO:
• Espacio: Play/Pause
• G: Cargar planeador
• P: Cargar pulsar
• B: Cargar faro
• T: Cargar sapo
• F: Pantalla completa
• H: Esta ayuda
• Ctrl+S: Guardar estado
• Ctrl+L: Cargar estado
• Ctrl+C: Limpiar todo
• Ctrl+R: Recargar patrón
• Ctrl+N: Siguiente generación
• Escape: Limpiar selección
• Delete: Limpiar área seleccionada

📱 CONTROLES TÁCTILES:
• Toque: Alternar celda
• Arrastrar: Dibujar celdas
• Toque largo: Menú contextual

🔬 UTILIDADES DE CONSOLA:
• gameUtils.getStats(): Ver estadísticas
• gameUtils.loadRandomPattern(): Patrón aleatorio
• gameUtils.exportState(): Exportar estado
• gameUtils.importState(json): Importar estado
        `;
        
        console.log(helpContent);
        alert('Ayuda mostrada en la consola (F12)');
    }

    /**
     * Guarda el estado actual
     */
    saveCurrentState() {
        try {
            const state = {
                grid: this.grid.getGridState(),
                generation: this.simulation.generation,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('gameOfLife_savedState', JSON.stringify(state));
            console.log('Estado guardado exitosamente');
            
        } catch (error) {
            console.error('Error al guardar estado:', error);
        }
    }

    /**
     * Carga un estado guardado
     */
    loadState() {
        try {
            const savedState = localStorage.getItem('gameOfLife_savedState');
            if (!savedState) {
                console.log('No hay estado guardado');
                return;
            }
            
            const state = JSON.parse(savedState);
            this.simulation.pause();
            this.grid.setGridState(state.grid);
            
            console.log('Estado cargado exitosamente');
            
        } catch (error) {
            console.error('Error al cargar estado:', error);
        }
    }

    /**
     * Limpia todos los event listeners
     */
    cleanup() {
        this.clearSelection();
        
        // Remover menú contextual si existe
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.remove();
        }
    }
}

// Exportar para uso global
window.EventHandlers = EventHandlers;