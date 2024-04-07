class Board {
    constructor(objects) {
        this.buildings = []; // list of Polygons
        this.numCameras = null;
        this.priorityZones = [] // list of polygons
        this.width = 900; // Example width
        this.height = 900; // Example height
        this.initObjects(objects);

        console.log(this.buildings)

        for (let i = 0; i < this.buildings.length; i++) {
            console.log("Building " + i + ":" + this.buildings[i].points);
        }
    }

    initObjects(objects) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].id === "building") {
                this.addBuilding(objects[i]);
            }
            else {
                this.addZone(objects[i], objects[i].id);
            }
            console.log(objects[i]);
        }
    }

    addBuilding(object) {
        let p = new Polygon([
            [object.startX,object.startY],
            [object.endX,object.startY],
            [object.endX,object.endY],
            [object.startX,object.endY]
        ])
        if (!this.buildIntersectingPolygons(p)){
            this.buildings.push(p);
        }
    }

    /**
     * Checks existing building to see if this shape collides with them
     * if so, the intersected shape calls combine,
     * if there are no possible intersections, the shape is added to the buildings list
     */
    buildIntersectingPolygons(poly) {
        return false;
    }

    addZone(object, id) {
        let p = new Polygon([
            [object.startX,object.startY],
            [object.endX,object.startY],
            [object.endX,object.endY],
            [object.startX,object.endY]
        ])
        this.priorityZones.push({shape:p,weight:getWeight(object.id)});
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
                sectors.push(cell);
            }
        }

        return sectors;
    }
    /**
     * Iterates through all priority zones and creates a weighted point at their centroids
     * returns a list of weighted points
     */
    simplifyPriorityZones() {
        let simplifiedPriorityZones = [];
        this.priorityZones.forEach(zone => {
            const cell = {
                coord: zone.shape.centroid(),
                weight: zone.weight
            };
            simplifiedPriorityZones.push(cell)
        });
        return simplifiedPriorityZones;
    }

    /**
     * Iterates through each of the 9 zones and takes the weighted average of the points in that zone
     * returns the 9 points and their weights
     */
    createPriorityPoints() {
        const sectors = this.makeSectors();
        const priorityPoints = this.simplifyPriorityZones();
        let finalOut = [];

        sectors.forEach(sector => {
            var sectorWeight = 0;
            var Xtot = 0;
            var Ytot = 0;
            priorityPoints.forEach(zone => {
                if (sector.left < zone.coord[0] && zone.coord[0] <= sector.right && sector.bottom < zone.coord[1] && zone.coord[1] <= sector.top) {
                    sectorWeight += zone.weight;
                    Xtot += zone.coord[0];
                    Ytot += zone.coord[1];
                }
                
            });
            let cell = {
                    coords: [Xtot/sectorWeight, Ytot/sectorWeight],
                    totalWeight: sectorWeight
                };
                finalOut.push(cell);
        });

        return finalOut;
    }

    /**
     * Calculate point weight
     * (placeholder, to be called in simplifyPriorityZones)
     */
    calculatePriorityWeight() {
        return 1;
    }
}

/**
 * Returns a float from 1-4 that is the weight of the importance of that object
 * @param id
 * @returns {number}
 */
function getWeight(id) {
    return 1;
}