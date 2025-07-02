class Cell {
    constructor(row, col, isAlive = false) {
        this.row = row;
        this.col = col;
        this.isAlive = isAlive;
        this.element = null;
    }

    /**
     * Createt the cell element
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
     * Toggle th state of a cell
     */
    toggle() {
        console.log('Toggle cell');
        this.isAlive = !this.isAlive;
        this.updateVisualState();
    }

    /**
     * Set the state of a cell
     */
    setState(isAlive) {
        this.isAlive = isAlive;
        this.updateVisualState();
    }

    /**
     * Update the visual state of the cell
     */
    updateVisualState() {
        if (this.element) {
            this.element.classList.toggle('alive', this.isAlive);
        }
    }

    /**
     * Get the current state of a cell
     */
    getState() {
        return this.isAlive;
    }
}