const {Polygon} = require("./Polygon");
const {Camera, placeCameras} = require("./Camera");
const {Line} = require("./Line");
console.log("hello world")


// Example polygon: A simple quadrilateral
const pointsQuadrilateral = [
    [1, 1],  // Bottom left
    [1, 4],  // Top left
    [4, 4],  // Top right
    [4, 1]   // Bottom right
];

// Instantiate the Polygon with the points
const quadrilateral = new Polygon(pointsQuadrilateral);

// Calculate the centroid of the polygon
const centroid = quadrilateral.centroid();

// Log the centroid to the console
console.log("Centroid of the quadrilateral:", centroid);

// Example polygon: A triangle
const pointsTriangle = [
    [0, 0],  // Vertex 1
    [6, 0],  // Vertex 2
    [3, 6]   // Vertex 3
];

// Instantiate the Polygon with the points
const triangle = new Polygon(pointsTriangle);

// Calculate the centroid of the polygon
const centroidTriangle = triangle.centroid();

// Log the centroid to the console
console.log("Centroid of the triangle:", centroidTriangle);


/*
const points1 = [[0, 0], [0, 4], [3, 4], [3, 0]];
const points2 = [[1, 1], [1, 5], [4, 5], [4, 1]];
const polygon1 = new Polygon(points1);
const polygon2 = new Polygon(points2);
console.log('Intersection Area:', polygon1.intersect(polygon2)); // Output the intersection area
*/

/*

// Example usage:
Camera.setFOV(120);
Camera.setFOD(30);
const camera1 = new Camera(120,30);
const camera2 = new Camera(120,30);
const cameras = [camera1, camera2];

let lineSegment = new Line([1, 40], [40, 1]); // Line segment from (0, 0) to (10, 10)
const point = [25, 25]; // Arbitrary point not on the line segment

placeCameras(cameras, lineSegment, point);

console.log("Camera 1 Position:", camera1.getPosition());
console.log("Camera 1 Rotation:", camera1.getRotation());
console.log("Camera 2 Position:", camera2.getPosition());
console.log("Camera 2 Rotation:", camera2.getRotation());
*/

// Example usage of polygon and point

//console.log((-5/0) === -Infinity)
