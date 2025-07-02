class Cell {
    constructor(row, col, isAlive = false) {
        this.row = row;
        this.col = col;
        this.isAlive = isAlive;
        this.element = null;
    }

    /**
     * Crea el elemento DOM para la celda
     */
    createElement() {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = this.row;
        cell.dataset.col = this.col;
        this.element = cell;
        this.updateVisualState();
        return cell;
    }

    /**
     * Alterna el estado vivo/muerto de la celda
     */
    toggle() {
        console.log('Toggle cell');
        this.isAlive = !this.isAlive;
        this.updateVisualState();
    }

    /**
     * Establece el estado de la celda
     */
    setState(isAlive) {
        this.isAlive = isAlive;
        this.updateVisualState();
    }

    /**
     * Actualiza la apariencia visual de la celda
     */
    updateVisualState() {
        if (this.element) {
            this.element.classList.toggle('alive', this.isAlive);
        }
    }

    /**
     * Obtiene el estado actual de la celda
     */
    getState() {
        return this.isAlive;
    }
}