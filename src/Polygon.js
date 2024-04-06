/*
 * Polygon object
 */
const {Line} = require("./Line");

class Polygon {
    constructor(points) {
        this.points = points;
    }

    area() {
        if (this.points.length < 3) {
            throw new Error('A polygon must have at least 3 points.');
        }

        let area = 0;
        for (let i = 0; i < this.points.length; i++) {
            const [x1, y1] = this.points[i];
            const [x2, y2] = this.points[(i + 1) % this.points.length];
            area += (x1 * y2 - x2 * y1);
        }
        return Math.abs(area) / 2;
    }
    centroid() {
        let cx = 0, cy = 0;
        const N = this.points.length;
        let A = this.area(); // Calculate the signed area

    // Correct the formula by ensuring the division is done with the absolute value of A
    // Note: We multiply by 6 as part of the centroid formula, not as a correction factor for A
        A *= 6;

        for (let i = 0; i < N; i++) {
            const [x1, y1] = this.points[i];
            const [x2, y2] = this.points[(i + 1) % N];
            const common = x1 * y2 - x2 * y1;
            cx += (x1 + x2) * common;
            cy += (y1 + y2) * common;
    }

    // Apply the absolute value of A in the division to get the correct sign for the centroid coordinates
        cx /= Math.abs(A); // Correctly applying the division by the absolute area value
        cy /= Math.abs(A);

        return [cx / 2.0, cy / 2.0]; // Final centroid coordinates
}


    intersect(otherPolygon) {
        // Check if the input is a valid instance of Polygon class
        if (!(otherPolygon instanceof Polygon)) {
            throw new Error('Input must be an instance of the Polygon class.');
        }

        // Check if either polygon has no points or is null
        if (!this.points || !otherPolygon.points) {
            return 0;
        }

        let intersectionArea = 0;

        // Iterate through each edge of the first polygon
        for (let i = 0; i < this.points.length; i++) {
            const edgeStart = this.points[i];
            const edgeEnd = this.points[(i + 1) % this.points.length];

            // Clip the other polygon by the current edge of the first polygon
            const clippedPoints = otherPolygon.clipPolygon(edgeStart, edgeEnd);

            // Debug log: Print the clipped polygon for each edge
            console.log('Clipped polygon:', clippedPoints);

            // Compute the area of the clipped polygon and add it to the total intersection area
            intersectionArea += this.computeAreaOfPolygon(clippedPoints);
        }

        return intersectionArea;
    }


    clipPolygon(edgeStart, edgeEnd) {
        if (!this.points || this.points.length === 0) {
            return [];
        }

        let input = this.points;
        let output = [];

        for (let j = 0; j < input.length; j++) {
            const p1 = input[j];
            const p2 = input[(j + 1) % input.length];
            const [qx, qy] = this.computeIntersection(edgeStart, edgeEnd, p1, p2);

            // Debug log: Print the intersection point for the current pair of points
            console.log('Intersection point:', [qx, qy]);

            // Check if there is an intersection point between p1 and p2
            if (qx !== undefined && qy !== undefined && this.isInsidePolygon(p2, [edgeStart, edgeEnd])) {
                output.push([qx, qy]);
            }
            console.log('Intersect point:', p1, p2);

            // Debug log: Check if p2 is inside the clipping edge
            console.log('Is p2 inside:', this.isInsidePolygon(p2, [edgeStart, edgeEnd]));
        }

        return output;
    }



    computeIntersection(edgeStart, edgeEnd, p1, p2) {
        const [x1, y1] = edgeStart;
        const [x2, y2] = edgeEnd;
        const [x3, y3] = p1;
        const [x4, y4] = p2;

        // Check if points p1 and p2 are on the same side of the clipping edge
        const side1 = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
        const side2 = (x4 - x3) * (y2 - y3) - (y4 - y3) * (x2 - x3);
        console.log('Side1:', side1);
        console.log('Side2:', side2);

        if (side1 * side2 >= 0) {
            // Points p1 and p2 are on the same side, lines are parallel
            console.log('Intersection point: [undefined, undefined]');
            return [undefined, undefined];
        }

        // Compute intersection point using alternative method
        const t = side1 / (side1 - side2);
        const qx = x1 + t * (x2 - x1);
        const qy = y1 + t * (y2 - y1);
        console.log('Intersection point:', [qx, qy]);

        return [qx, qy];
    }





    isInsidePolygon(point, polygon) {
        const [x, y] = point;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0];
            const yi = polygon[i][1];
            const xj = polygon[j][0];
            const yj = polygon[j][1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    combineClippedPolygons(poly1, poly2) {
        // Combine two clipped polygons by taking their intersection points
        const combined = [];
        for (let i = 0; i < poly1.length; i++) {
            if (this.isInsidePolygon(poly1[i], poly2)) {
                combined.push(poly1[i]);
            }
        }
        for (let i = 0; i < poly2.length; i++) {
            if (this.isInsidePolygon(poly2[i], poly1)) {
                combined.push(poly2[i]);
            }
        }
        return combined;
    }

    computeAreaOfPolygon(polygon) {
        let area = 0;
        for (let i = 0; i < polygon.length; i++) {
            const [x1, y1] = polygon[i];
            const [x2, y2] = polygon[(i + 1) % polygon.length];
            area += (x1 * y2 - x2 * y1);
        }
        return Math.abs(area) / 2;
    }
}

function nearestLine(target, polygons) {
    // find closest point
    let closestPoint = [];
    for (const polygon in polygons) {
        for (const point in polygon.points) {
            if (Line.length(target,point) < Line.length(target, closestPoint)){
                closestPoint = point;
            }
        }
    }

    // cast ray to point
    let l = new Line(target, closestPoint);

    // check for intercepts
    let intercepts = [];
    for (let i = 0; i < polygons.length; i++) {

    }
}

module.exports = {Polygon}
