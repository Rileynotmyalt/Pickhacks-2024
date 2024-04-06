class Board {
    constructor() {
        this.buildings = []; // list of Polygons
        this.numCameras = null;
        this.priorityZones = [] // list of polygons
        this.width = 900; // Example width
        this.height = 900; // Example height
    }

    /**
     * Divides the board into a 3x3 grid, creating 9 zones.
     */
    makeSectors() {
        const gridSize = 3;
        const cellWidth = this.width / gridSize;
        const cellHeight = this.height / gridSize;

        let sectors = [];

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = {
                    left: col * cellWidth,
                    right: (col + 1) * cellWidth,
                    top: row * cellHeight,
                    bottom: (row + 1) * cellHeight
                };
                sectprs.push(cell);
            }
        }

        return sectors;
    }
    /**
     * Iterates through all priority zones and creates a weighted point at their centroids
     * returns a list of weighted points
     */
    simplifyPriorityZones() {

    }

    /**
     * Iterates through each of the 9 zones and takes the weighted average of the points in that zone
     * returns the 9 points and their weights
     */
    createPriorityPoints() {

    }

    /**
     * Calculate point weight
     * (placeholder, to be called in simplifyPriorityZones)
     */
    calculatePriorityWeight() {
        return 1;
    }
}

