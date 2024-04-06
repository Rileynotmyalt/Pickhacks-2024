class Board {
    constructor() {
        this.buildings = []; // list of Polygons
        this.numCameras = null;
        this.priorityZones = [] // list of polygons
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

