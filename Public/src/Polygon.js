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
        cx /= A; // Correctly applying the division by the absolute area value
        cy /= A;

        return [Math.abs(cx) , Math.abs(cy)]; // Final centroid coordinates
    }


    combineIntersection(otherPolygon) {
        let final = [];
    
        const lines = this.getLines();
        const otherLines = otherPolygon.getLines();
    
        lines.forEach(line => {
            otherLines.forEach(otherLine => {
                if (line.intersects(otherLine)) {
                    const intersectionPoint = line.intercept(otherLine);
    
                    // Check if the intersection point is not already in the final list
                    if (!final.includes(intersectionPoint)) {
                        final.push(intersectionPoint);
                    }
                }
            });
        });
    
        // Order the points in the final intersection polygon
        this.points = this.orderIntersectionPoints(final);
    }
    
    getLines() {
        return this.points.map((point, i) => new Line(point, this.points[(i + 1) % this.points.length]));
    }
    
    orderIntersectionPoints(points) {
        let currentPoint = this.points[0]; // Start with a point from this polygon
        while (!this.isInsidePolygon(currentPoint, points)) {
            currentPoint = this.points[(this.points.indexOf(currentPoint) + 1) % this.points.length]; // Try another point
        }
    
        const orderedPoints = [];
        orderedPoints.push(currentPoint);
    
        while (currentPoint !== orderedPoints[0]) { // Continue until we reach the starting point again
            let foundNext = false;
            for (let i = 0; i < points.length; i++) {
                const pointA = points[i];
                const pointB = points[(i + 1) % points.length];
    
                if (
                    (pointA.equals(currentPoint) && !orderedPoints.includes(pointB)) ||
                    (pointB.equals(currentPoint) && !orderedPoints.includes(pointA))
                ) {
                    orderedPoints.push(pointA.equals(currentPoint) ? pointB : pointA);
                    currentPoint = orderedPoints[orderedPoints.length - 1];
                    foundNext = true;
                    break;
                }
            }
    
            if (!foundNext) {
                // Handle potential dead ends (might not be needed in most cases)
                console.warn("Dead end encountered in intersection ordering. Attempting with a different starting point.");
                currentPoint = this.points[this.points.indexOf(currentPoint) + 1]; // Try a different point
            }
        }
    
        return orderedPoints;
    }

    intersects(otherPolygon) {
        const myLines = this.getLines();
        const otherLines = otherPolygon.getLines();

        console.log(myLines);
        console.log(otherLines);

        // Loop through each line segment in this polygon
        for (let i = 0; i < myLines.length; i++) {
          // Loop through each line segment in the other polygon
          for (let j = 0; j < otherLines.length; j++) {
            if (myLines[i].intersects(otherLines[j])) {
              return true; // Found intersection, polygons intersect
            }
          }
        }
      
        // No intersection found after checking all line segments
        return false;
      }
      
      
    

    isInsidePolygon(point, polygon) {
        const [x, y] = point;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const [xi, yi] = polygon[i];
          const [xj, yj] = polygon[j];
      
          // Handle collinear points (same x or y)
          if (xi === xj) {
            if (x <= Math.max(xi, xj) && x >= Math.min(xi, xj)) {
              // Check if y coordinate is between polygon points
              if (y > Math.min(yi, yj) && y < Math.max(yi, yj)) {
                inside = !inside;
              }
            }
            continue;
          }
      
          const intersect = ((yi > y) !== (yj > y)) &&
                           (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;
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
    // find the closest point
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
        for (let j = 0; j < polygons[i].points.length; j++) {
            let line = new Line(polygons[i].points[j], polygons[i].points[(j+1)% polygons[i].points.length]);
            if (line.intersects(l)) {
                intercepts.push(line);
            }
        }
    }

    // if there are multiple intercepts, pick the closest one.
    if (intercepts.length > 1) {
        let closestIntercept = null;
        let closestInterceptDistance = Infinity;
        for (let i = 0; i < intercepts.length; i++) {
            let interceptDistance = Line.length(target, intercepts[i].intercept(l));
            if (interceptDistance < closestInterceptDistance) {
                closestIntercept = i;
                closestInterceptDistance = interceptDistance;
            }
        }
        return intercepts[closestIntercept];
    } else if (intercepts.length === 0) {
        return intercepts[0];
    }
    return null;
}