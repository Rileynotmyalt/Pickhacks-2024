const {Line} = require("./Line");

class Camera {
    static FOV = null;
    static FOD = null;

    constructor() {
        if (!Camera.FOV || !Camera.FOD) {
            console.error(new TypeError("Static variable FOV or FOD not initialised"));
        }
        this.position = [0, 0];
        this.rotation = 0;
    }

    // Getters and setters for properties
    getPosition() {
        return this.position;
    }

    setPosition(pos) {
        this.position = pos;
    }

    getRotation() {
        return this.rotation;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    static getFOV() {
        return this.FOV;
    }

    static setFOV(fieldOfView) {
        this.FOV = fieldOfView;
    }

    // Method to return falloff distance
    static getFOD() {
        return this.FOD; // Arbitrary value, you can change it as needed
    }

    static setFOD(fallOffDistance) {
        this.FOD = fallOffDistance;
    }
}

// Function to place cameras
function placeCameras(cameras, lineSegment, point) {

    // calculate max d value, then determine if b is valid,
    // check if camera points are possible
    let p0 = lineSegment.perpendicularIntersection(point);
    let s1 = new Line(lineSegment.p1, p0);
    let s2 = new Line(p0, lineSegment.p2);
    let maxD = Camera.FOD * Math.cos(45*(Math.PI/180)); // 45degree / equilateral triangle is max optimal

    if (s1.length() >= maxD && s2.length() >= maxD) {
        console.log("Creating Optimal Arrangement")
        // now solve for global position and rotation for cameras
        cameras[0].setPosition(lineSegment.findPointGivenDistance(p0,-maxD));
        cameras[1].setPosition(lineSegment.findPointGivenDistance(p0,maxD));

        // rotation
        let theta;
        if (lineSegment.slope() === Infinity || lineSegment.slope() === -Infinity) {
            theta = lineSegment.slope() > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
            // Calculate angle theta
            theta = Math.atan(lineSegment.slope())*180/Math.PI;
        }

        // cases,
        cameras[0].setRotation(theta+45+(Camera.FOV/2));
        cameras[1].setRotation(theta+135-(Camera.FOV/2));
    } else {
        console.log("Creating Sub-Optimal Arrangement\nNot yet Implemented"); //TODO
    }
}

module.exports = {Camera, placeCameras}