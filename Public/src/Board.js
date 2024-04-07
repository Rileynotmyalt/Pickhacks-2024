class Board {
    constructor(objects, sceneData) {
        this.cameras = [];
        this.numCameras = sceneData.cameraQuantiy;
        Camera.FOV = 40 // sceneData.FOV
        Camera.FOD = 120 // sceneData.FOV

        this.width = sceneData.imageWidth; // Example width
        this.height = sceneData.imageHeight; // Example height

        this.buildings = []; // list of Polygons
        this.priorityZones = [] // list of polygons

        this.initObjects(objects);
        this.priorityPoints = this.createPriorityPoints()
        this.calculateCameras();

        for (let i = 0; i < this.buildings.length; i++) {
            console.log(this.buildings[i].points);
        }
    }

    initObjects(objects) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].typeID === "Exterior Walls") {
                this.addBuilding(objects[i]);
            }
            else {
                this.addZone(objects[i]);
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
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].intersects(poly)) {
                this.buildings[i].combineIntersection(poly);
                return true;
            }
        }
        return false;
    }

    addZone(object) {
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
                    x1: col * cellWidth,
                    x2: (col + 1) * cellWidth,
                    y1: row * cellHeight,
                    y2: (row + 1) * cellHeight
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
        console.log(sectors);
        console.log(this.width,this.height)
        sectors.forEach(sector => {
            var sectorWeight = 0;
            var Xtot = 0;
            var Ytot = 0;
            priorityPoints.forEach(zone => {
                if (sector.x1 < zone.coord[0] && zone.coord[0] <= sector.x2 && sector.y2 > zone.coord[1] && zone.coord[1] <= sector.y1) {
                    sectorWeight += zone.weight;
                    Xtot += zone.coord[0];
                    Ytot += zone.coord[1];
                }
                
            });
            let cell = {
                    coords: [Xtot/sectorWeight, Ytot/sectorWeight],
                    totalWeight: sectorWeight
                };
                if (sectorWeight > 0) {
                    finalOut.push(cell);
                };
        });

        return finalOut;
    }

    sortPriorityPoints() {
        this.priorityPoints.sort((a, b) => b.totalWeight - a.totalWeight);
    }

    /**
     * Calculate point weight
     * (placeholder, to be called in simplifyPriorityZones)
     */
    calculatePriorityWeight() {
        return 1;
    }

    calculateCameras() {
        for (let i = 0; i < this.numCameras; i++) {
            this.cameras[i] = new Camera();
        }
        // do the math and stuff
        // sort
        this.sortPriorityPoints();
        for (let i = 0; i < this.priorityPoints.length; i+2) {
            // get nearest line
            let l = nearestLine(this.priorityPoints[i], this.buildings)
            // split list into 2 cameras
            var twoCam = [this.cameras[i], this.cameras[i+1]];
            // pass camera to place camera
            placeCameras(twoCam, l, this.priorityPoints[i/2]);
        }
    }

    getCameras() {
        return this.cameras.map(camera => {
            return {
                x: camera.position[0],
                y: camera.position[1],
                rotation: camera.rotation
            }
        })
    }
}

/**
 * Returns a float from 1-4 that is the weight of the importance of that object
 * @param id
 * @returns {number}
 */
function getWeight(id) {
    switch(id) {
        case "Car":
            return 2.8
        case "Door":
            return 4.0
        case "Window":
            return 2.1
        case "Pool":
            return 2.0
        default:
            return 1.0
    }
}
